import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, UploadCloud, Loader2, CheckCircle, AlertTriangle, Trash2, Leaf, Activity, Clock, TrendingUp, Video, VideoOff, Aperture as Capture } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import API_BASE_URL from '../config/apiConfig';

interface PredictionResult {
  result: string;
  confidence: number;
  solution: string;
  timestamp?: string;
}

const AgriScan: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const token = localStorage.getItem('krishi-token');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<PredictionResult[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (user && token) {
      fetchHistory();
    }
  }, [user, token]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(API_BASE_URL + '/api/agriscan/history', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      setHistory(data.history || []);
    } catch (err) {
      console.error(err);
    }
  };

  const saveToHistory = async (prediction: PredictionResult) => {
    if (!user || !token) return;
    try {
      await fetch(API_BASE_URL + '/api/agriscan/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(prediction),
      });
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
      setPreview(null);
      setImage(null);
      setResult(null);
      setError(null);
    } catch (err) {
      setError('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            setImage(file);
            setPreview(URL.createObjectURL(file));
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
      setResult(null);
      setError(null);
      stopCamera();
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    setError(null);
    const formData = new FormData();
    formData.append('file', image);
    try {
      const res = await fetch(API_BASE_URL + '/api/predict', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Prediction failed');
      const data = await res.json();
      setResult(data);
      saveToHistory({ ...data, timestamp: new Date().toISOString() });
    } catch (err: any) {
      setError('Could not predict disease. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!user || !token) return;
    try {
      const res = await fetch(API_BASE_URL + '/api/agriscan/history', {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      if (!res.ok) throw new Error('Failed to clear history');
      setHistory([]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteFromHistory = async (index: number) => {
    if (!user || !token) return;
    try {
      // First, get the current history
      const res = await fetch(API_BASE_URL + '/api/agriscan/history', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      const historyData = data.history || [];

      // Remove the item at the specified index
      historyData.splice(index, 1);

      // Send the updated history back to the server
      const updateRes = await fetch(API_BASE_URL + '/api/agriscan/history', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ history: historyData }),
      });

      if (!updateRes.ok) throw new Error('Failed to update history');

      // Update the local state
      setHistory(historyData);
    } catch (err) {
      console.error(err);
    }
  };

  const getHealthStatus = (result: string) => {
    return result === 'Healthy' ? 'healthy' : 'diseased';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 dark:text-green-400';
    if (confidence >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-emerald-300/20 rounded-full blur-lg"></div>
          
          <div className="relative z-10 p-10 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <Leaf className="h-8 w-8" />
                  </div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                    {t('agriscan')}
                  </h1>
                </div>
                <p className="text-xl text-green-100 mb-6 max-w-2xl leading-relaxed">
                  Advanced AI-powered plant disease detection system. Upload, capture, or use live camera feed for instant analysis and personalized treatment recommendations.
                </p>
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-green-200" />
                    <span className="text-green-100">Real-time Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Video className="h-5 w-5 text-green-200" />
                    <span className="text-green-100">Live Camera Feed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-200" />
                    <span className="text-green-100">95% Accuracy</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="w-40 h-40 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20">
                    <Camera className="h-20 w-20 text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Analysis Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Camera/Upload Section */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
              <Camera className="h-6 w-6 mr-3 text-green-600" />
              Capture Plant Image
            </h2>
            
            <div className="space-y-6">
              {/* Camera/Image Preview */}
              <div className="relative group">
                <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 transition-all duration-300 group-hover:border-green-400 dark:group-hover:border-green-500">
                  {cameraActive ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 border-4 border-green-400 rounded-2xl animate-pulse"></div>
                      <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span>LIVE</span>
                      </div>
                    </>
                  ) : preview ? (
                    <>
                      <img src={preview} alt="Preview" className="object-cover w-full h-full" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                    </>
                  ) : (
                    <div className="text-center">
                      <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 text-lg">No image selected</p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Use camera or upload image</p>
                    </div>
                  )}
                </div>
                {(preview || cameraActive) && (
                  <button
                    onClick={() => {
                      setPreview(null);
                      setImage(null);
                      setResult(null);
                      stopCamera();
                    }}
                    className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Camera Controls */}
              <div className="flex flex-col space-y-4">
                {!cameraActive ? (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={startCamera}
                      className="flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      <Video className="h-5 w-5" />
                      <span>Live Camera</span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      <UploadCloud className="h-5 w-5" />
                      <span>Upload Image</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={capturePhoto}
                      className="flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      <Capture className="h-5 w-5" />
                      <span>Capture Photo</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      <VideoOff className="h-5 w-5" />
                      <span>Stop Camera</span>
                    </button>
                  </div>
                )}
                
                {/* Analyze Button */}
                <button
                  onClick={handleUpload}
                  disabled={!image || loading}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Analyzing Plant...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Analyze Plant Health</span>
                    </>
                  )}
                </button>
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="flex items-center text-red-800 dark:text-red-400">
                    <AlertTriangle className="h-5 w-5 mr-3" />
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
              <Activity className="h-6 w-6 mr-3 text-emerald-600" />
              Analysis Results
            </h2>

            {result ? (
              <div className="space-y-6">
                {/* Status Card */}
                <div className={`p-6 rounded-2xl border-2 ${
                  getHealthStatus(result.result) === 'healthy' 
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800' 
                    : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200 dark:from-red-900/20 dark:to-orange-900/20 dark:border-red-800'
                }`}>
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                      getHealthStatus(result.result) === 'healthy' 
                        ? 'bg-green-100 dark:bg-green-800' 
                        : 'bg-red-100 dark:bg-red-800'
                    }`}>
                      {getHealthStatus(result.result) === 'healthy' ? (
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                      ) : (
                        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <h3 className={`text-3xl font-bold mb-2 ${
                      getHealthStatus(result.result) === 'healthy' 
                        ? 'text-green-700 dark:text-green-400' 
                        : 'text-red-700 dark:text-red-400'
                    }`}>
                      {result.result}
                    </h3>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <TrendingUp className={`h-4 w-4 ${getConfidenceColor(result.confidence)}`} />
                      <span className={`font-semibold ${getConfidenceColor(result.confidence)}`}>
                        {(result.confidence * 100).toFixed(1)}% Confidence
                      </span>
                    </div>
                  </div>
                </div>

                {/* Solution Card */}
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
                  <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-400 mb-3 flex items-center">
                    <Leaf className="h-5 w-5 mr-2" />
                    {getHealthStatus(result.result) === 'healthy' ? 'Plant Care Tips' : 'Treatment Recommendation'}
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    {result.solution}
                  </p>
                  {getHealthStatus(result.result) !== 'healthy' && (
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-yellow-800 dark:text-yellow-400 text-sm font-medium">
                        ⚠️ Please consult with an agricultural expert for comprehensive treatment.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <Activity className="h-16 w-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">Capture or upload an image to start analysis</p>
                <p className="text-sm mt-2 text-center max-w-xs">
                  Get instant AI-powered insights about your plant's health
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced History Section */}
        {user && (
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
                <Clock className="h-7 w-7 mr-3 text-blue-600" />
                Analysis History
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {history.length} record{history.length !== 1 ? 's' : ''}
                </span>
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">No analysis history yet</p>
                <p className="text-gray-400 dark:text-gray-500 mt-2">Start by analyzing your first plant image</p>
              </div>
            ) : (
              <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    className="group p-6 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-300 dark:hover:border-green-600"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`p-2 rounded-lg ${
                            getHealthStatus(item.result) === 'healthy' 
                              ? 'bg-green-100 dark:bg-green-800' 
                              : 'bg-red-100 dark:bg-red-800'
                          }`}>
                            {getHealthStatus(item.result) === 'healthy' ? (
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            )}
                          </div>
                          <div>
                            <h3 className={`font-bold text-lg ${
                              getHealthStatus(item.result) === 'healthy' 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {item.result}
                            </h3>
                            <p className={`text-sm font-medium ${getConfidenceColor(item.confidence)}`}>
                              {(item.confidence * 100).toFixed(1)}% confidence
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 leading-relaxed">
                          {item.solution}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(item.timestamp || '').toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteFromHistory(idx)}
                        className="ml-2 p-1.5 text-red-500 hover:text-red-700 dark:hover:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200"
                        title="Delete this analysis"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default AgriScan;