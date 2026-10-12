import React, { useRef, useState, useEffect } from 'react';
import { PenTool, RotateCcw, Upload, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface SignaturePadProps {
  value?: string; // base64 PNG
  onChange: (dataUrl: string) => void;
  onClear: () => void;
  error?: string;
  parentName?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  value,
  onChange,
  onClear,
  error,
  parentName = 'Orang Tua / Wali Siswa',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [inputMode, setInputMode] = useState<'draw' | 'upload'>('draw');

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.scale(ratio, ratio);

    ctx.strokeStyle = '#0F52BA'; // School Blue Ink
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // If an existing value is passed, draw it
    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasDrawn(true);
      };
      img.src = value;
    }
  }, [inputMode]);

  // Coordinates helper
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Export transparent PNG
    const dataUrl = canvas.toDataURL('image/png');
    onChange(dataUrl);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    onClear();
  };

  // Quick Sample Generator for Demonstrations
  const handleGenerateSample = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    ctx.strokeStyle = '#0F52BA';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const cx = rect.width / 2;
    const cy = rect.height / 2;

    // Draw an authentic cursive paraf / signature
    ctx.beginPath();
    ctx.moveTo(cx - 80, cy + 10);
    ctx.bezierCurveTo(cx - 60, cy - 35, cx - 40, cy - 30, cx - 30, cy + 5);
    ctx.bezierCurveTo(cx - 20, cy + 30, cx - 10, cy - 25, cx + 10, cy - 20);
    ctx.bezierCurveTo(cx + 30, cy - 15, cx + 45, cy + 20, cx + 70, cy - 5);
    ctx.stroke();

    // Flourish underline loop
    ctx.beginPath();
    ctx.moveTo(cx - 75, cy + 22);
    ctx.bezierCurveTo(cx - 20, cy + 18, cx + 30, cy + 28, cx + 85, cy + 20);
    ctx.stroke();

    setHasDrawn(true);
    const dataUrl = canvas.toDataURL('image/png');
    onChange(dataUrl);
  };

  // Upload image of signature from paper
  const handleUploadSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setHasDrawn(true);
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      
      {/* Mode Switcher */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setInputMode('draw')}
            className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
              inputMode === 'draw'
                ? 'bg-white text-[#0F52BA] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gores Langsung (Layar Sentuh / Mouse)
          </button>
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
              inputMode === 'upload'
                ? 'bg-white text-[#0F52BA] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Unggah Foto Tanda Tangan
          </button>
        </div>

        {hasDrawn && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
            <Check className="w-3.5 h-3.5" />
            Tanda Tangan Terekam
          </span>
        )}
      </div>

      {inputMode === 'draw' ? (
        <div className="space-y-2">
          {/* Canvas Box */}
          <div
            className={`relative w-full h-44 rounded-xl border-2 transition-colors bg-white overflow-hidden shadow-inner select-none ${
              error
                ? 'border-red-400 bg-red-50/20'
                : hasDrawn
                ? 'border-blue-400 bg-blue-50/10'
                : 'border-dashed border-slate-300 hover:border-blue-300'
            }`}
          >
            {/* Guide line and watermark */}
            <div className="absolute inset-x-8 bottom-10 border-b border-dashed border-slate-300 pointer-events-none flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-sans tracking-wide">
                ✕ Tanda tangan di atas garis ini
              </span>
              <span className="text-[10px] text-slate-500 font-sans italic">
                {parentName || 'Orang Tua / Wali'}
              </span>
            </div>

            {!hasDrawn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-600 space-y-1">
                <PenTool className="w-6 h-6 text-slate-600 mb-1" />
                <p className="text-xs font-semibold text-slate-700">
                  Goreskan tanda tangan Anda di area ini
                </p>
                <p className="text-[11px] text-slate-500">
                  Gunakan jari pada layar sentuh ponsel/tablet atau klik & seret mouse
                </p>
              </div>
            )}

            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{ touchAction: 'none' }}
              className="w-full h-full cursor-crosshair block relative z-10"
            />
          </div>

          {/* Action buttons under canvas */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClear}
                disabled={!hasDrawn}
                className="px-3 py-1.5 text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Hapus / Ulangi</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateSample}
                className="px-3 py-1.5 text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg font-medium transition-colors cursor-pointer"
                title="Buat paraf contoh untuk uji coba pengisian"
              >
                <span>Contoh Paraf Uji Coba</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-600">
              Warna Tinta: <strong className="text-[#0F52BA]">Biru Sekolah</strong>
            </span>
          </div>
        </div>
      ) : (
        /* Upload Mode */
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50 space-y-3">
          <input
            type="file"
            id="sign-upload"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleUploadSignature}
            className="hidden"
          />
          <label
            htmlFor="sign-upload"
            className="cursor-pointer flex flex-col items-center justify-center gap-2"
          >
            <Upload className="w-8 h-8 text-[#0F52BA]" />
            <span className="text-xs font-bold text-slate-800">
              Pilih Foto Tanda Tangan dari Kertas
            </span>
            <span className="text-[11px] text-slate-500">
              Ambil foto tanda tangan di atas kertas putih bersih (JPG atau PNG)
            </span>
          </label>

          {value && (
            <div className="pt-3 border-t border-slate-200 flex items-center justify-center gap-4">
              <img
                src={value}
                alt="Pratinjau Tanda Tangan"
                className="max-h-20 bg-white p-2 rounded border border-slate-300 shadow-xs object-contain"
              />
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-red-600 hover:underline font-semibold"
              >
                Hapus & Ganti
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </p>
      )}

    </div>
  );
};
