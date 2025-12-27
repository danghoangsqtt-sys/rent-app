
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

export const APP_DIRECTORY = Directory.Documents;

export class StorageService {
  /**
   * Lưu một object JSON vào file vật lý
   */
  static async saveJson(filename: string, data: any): Promise<void> {
    try {
      await Filesystem.writeFile({
        path: `rentmaster/${filename}.json`,
        data: JSON.stringify(data),
        directory: APP_DIRECTORY,
        encoding: Encoding.UTF8,
        recursive: true
      });
    } catch (e) {
      console.error('Error saving JSON:', e);
    }
  }

  /**
   * Đọc object JSON từ file vật lý
   */
  static async readJson(filename: string): Promise<any | null> {
    try {
      const result = await Filesystem.readFile({
        path: `rentmaster/${filename}.json`,
        directory: APP_DIRECTORY,
        encoding: Encoding.UTF8,
      });
      if (typeof result.data === 'string') {
        return JSON.parse(result.data);
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Lưu file media (blob) vào bộ nhớ vật lý và trả về URI
   */
  static async saveMedia(base64Data: string, prefix: string = 'img'): Promise<string> {
    try {
      const fileName = `${prefix}-${Date.now()}.jpg`;
      // Loại bỏ header data:image/jpeg;base64, nếu có
      const cleanBase64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;

      const result = await Filesystem.writeFile({
        path: `rentmaster/media/${fileName}`,
        data: cleanBase64,
        directory: APP_DIRECTORY,
        recursive: true
      });

      return result.uri;
    } catch (e) {
      console.error('Error saving media:', e);
      return base64Data; // Fallback trả về base64 nếu lỗi
    }
  }

  /**
   * Chuyển đổi file path sang URL có thể hiển thị trong WebView
   */
  static getDisplayUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    // Đối với Capacitor, cần convert file:// sang nội bộ
    return Capacitor.convertFileSrc(path);
  }
}
