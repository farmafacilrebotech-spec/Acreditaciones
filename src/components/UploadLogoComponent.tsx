import { ImagePlus } from 'lucide-react';

interface UploadLogoComponentProps {
  logo: string | null;
  onLogoUpload: (logo: string) => void;
}

export default function UploadLogoComponent({ logo, onLogoUpload }: UploadLogoComponentProps) {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onLogoUpload(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border-2 border-yellow-600">
      <h2 className="text-xl font-bold text-yellow-500 mb-4">Logo del Club</h2>
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-yellow-600 border-dashed rounded-lg cursor-pointer bg-black hover:bg-gray-800 transition-colors">
          {logo ? (
            <img src={logo} alt="Logo preview" className="h-24 object-contain" />
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImagePlus className="w-10 h-10 mb-3 text-yellow-500" />
              <p className="mb-2 text-sm text-gray-300">
                <span className="font-semibold">Click para subir logo</span>
              </p>
              <p className="text-xs text-gray-400">PNG, JPG (MAX. 2MB)</p>
            </div>
          )}
          <input
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleLogoUpload}
          />
        </label>
      </div>
    </div>
  );
}
