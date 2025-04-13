import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { cn } from '~/lib/utils';
import { UploadCloud, X } from 'lucide-react';

/**
 * Image Upload Component - Mermaid Sequence Diagram
 * ```mermaid
 * sequenceDiagram
 *     participant User
 *     participant ImageUpload
 *     participant Parent
 *     
 *     User->>ImageUpload: Select Image File
 *     ImageUpload->>ImageUpload: Convert to Base64
 *     ImageUpload->>Parent: onImageSelect(base64Data)
 *     User->>ImageUpload: Click Clear
 *     ImageUpload->>ImageUpload: Reset State
 *     ImageUpload->>Parent: onImageSelect(null)
 * ```
 */
interface ImageUploadProps {
    onImageSelect: (imageBase64: string | null) => void;
    className?: string;
    accept?: string;
    maxSizeMB?: number;
    disabled?: boolean;
}

export function ImageUpload({
    onImageSelect,
    className,
    accept = "image/jpeg, image/png, image/jpg",
    maxSizeMB = 5,
    disabled = false,
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        processFile(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (disabled) return;

        if (e.dataTransfer.files?.length) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const processFile = (file?: File) => {
        setError(null);

        if (!file) {
            return;
        }

        // Check file type
        if (!accept.split(', ').includes(file.type)) {
            setError(`Invalid file type. Please upload ${accept} files only.`);
            return;
        }

        // Check file size
        if (file.size > maxSizeBytes) {
            setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            const result = e.target?.result as string;
            setPreview(result);
            // Remove the prefix 'data:image/jpeg;base64,' before passing the base64 string
            const base64Data = result.split(',')[1];
            onImageSelect(base64Data);
        };

        reader.onerror = () => {
            setError('Error reading file.');
        };

        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setPreview(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onImageSelect(null);
    };

    return (
        <div className={cn('flex flex-col space-y-4', className)}>
            {!preview ? (
                <div
                    className={cn(
                        'border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer text-center',
                        isDragging ? 'border-primary bg-primary/5' : 'border-muted',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                    onDragOver={(e) => {
                        e.preventDefault();
                        if (!disabled) setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => {
                        if (!disabled && fileInputRef.current) {
                            fileInputRef.current.click();
                        }
                    }}
                >
                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">
                            {isDragging ? 'Drop image here' : 'Drag and drop image here'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            or click to browse (max {maxSizeMB}MB)
                        </p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept={accept}
                        onChange={handleFileChange}
                        disabled={disabled}
                    />
                </div>
            ) : (
                <div className="relative rounded-lg overflow-hidden">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-auto max-h-96 object-contain"
                    />
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full"
                        onClick={clearImage}
                        disabled={disabled}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {error && (
                <p className="text-destructive text-sm">{error}</p>
            )}
        </div>
    );
} 