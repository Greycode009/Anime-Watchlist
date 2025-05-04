package com.anime_dipesh.app;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Process;
import android.util.DisplayMetrics;
import android.util.LruCache;

import java.io.ByteArrayOutputStream;

/**
 * Utility class to optimize resource usage in the app
 * Helps reduce memory usage and app size
 */
public class ResourceOptimizer {
    
    // Cache for decoded bitmaps to avoid reloading
    private static LruCache<String, Bitmap> mMemoryCache;
    
    // Initialize the cache
    public static void init(Context context) {
        if (mMemoryCache == null) {
            // Use a small percentage of available memory for the cache
            final int maxMemory = (int) (Runtime.getRuntime().maxMemory() / 1024);
            // Use 1/8th of the available memory for this memory cache
            final int cacheSize = maxMemory / 8;
            
            mMemoryCache = new LruCache<String, Bitmap>(cacheSize) {
                @Override
                protected int sizeOf(String key, Bitmap bitmap) {
                    // The cache size will be measured in kilobytes
                    return bitmap.getByteCount() / 1024;
                }
            };
        }
        
        // Set process priority to background if in release mode
        if (!BuildConfig.DEBUG) {
            Process.setThreadPriority(Process.THREAD_PRIORITY_BACKGROUND);
        }
    }
    
    /**
     * Load a bitmap with optimizations for memory usage
     */
    public static Bitmap decodeSampledBitmapFromResource(Resources res, int resId, int reqWidth, int reqHeight) {
        String cacheKey = String.valueOf(resId);
        
        // Check if the bitmap is in the cache
        Bitmap cachedBitmap = getBitmapFromMemCache(cacheKey);
        if (cachedBitmap != null) {
            return cachedBitmap;
        }
        
        // First decode with inJustDecodeBounds=true to check dimensions
        final BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeResource(res, resId, options);
        
        // Calculate inSampleSize
        options.inSampleSize = calculateInSampleSize(options, reqWidth, reqHeight);
        
        // Use RGB_565 instead of ARGB_8888 for smaller memory footprint
        options.inPreferredConfig = Bitmap.Config.RGB_565;
        
        // Additional optimizations for newer Android versions
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            options.inPreferredColorSpace = android.graphics.ColorSpace.get(android.graphics.ColorSpace.Named.SRGB);
        }
        
        // Decode bitmap with inSampleSize set
        options.inJustDecodeBounds = false;
        Bitmap bitmap = BitmapFactory.decodeResource(res, resId, options);
        
        // Compress bitmap to reduce size further (for non-UI critical images)
        bitmap = compressBitmap(bitmap, 80);
        
        // Add to memory cache
        addBitmapToMemCache(cacheKey, bitmap);
        
        return bitmap;
    }
    
    /**
     * Compress a bitmap to reduce size
     */
    private static Bitmap compressBitmap(Bitmap original, int quality) {
        if (original == null) return null;
        
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        original.compress(Bitmap.CompressFormat.JPEG, quality, out);
        return BitmapFactory.decodeByteArray(out.toByteArray(), 0, out.size());
    }
    
    /**
     * Calculate optimal sample size to load image at smaller resolution
     */
    private static int calculateInSampleSize(BitmapFactory.Options options, int reqWidth, int reqHeight) {
        // Raw height and width of image
        final int height = options.outHeight;
        final int width = options.outWidth;
        int inSampleSize = 1;
        
        if (height > reqHeight || width > reqWidth) {
            final int halfHeight = height / 2;
            final int halfWidth = width / 2;
            
            // Calculate the largest inSampleSize value that is a power of 2 and keeps both
            // height and width larger than the requested height and width.
            while ((halfHeight / inSampleSize) >= reqHeight && (halfWidth / inSampleSize) >= reqWidth) {
                inSampleSize *= 2;
            }
        }
        
        return inSampleSize;
    }
    
    /**
     * Add a bitmap to memory cache
     */
    private static void addBitmapToMemCache(String key, Bitmap bitmap) {
        if (getBitmapFromMemCache(key) == null && bitmap != null && mMemoryCache != null) {
            mMemoryCache.put(key, bitmap);
        }
    }
    
    /**
     * Get a bitmap from memory cache
     */
    private static Bitmap getBitmapFromMemCache(String key) {
        if (mMemoryCache != null) {
            return mMemoryCache.get(key);
        }
        return null;
    }
    
    /**
     * Clean up memory cache
     */
    public static void clearCache() {
        if (mMemoryCache != null) {
            mMemoryCache.evictAll();
        }
    }
    
    /**
     * Get optimal screen dimensions for image loading based on device screen
     */
    public static int[] getOptimalDimensions(Context context) {
        DisplayMetrics displayMetrics = context.getResources().getDisplayMetrics();
        int screenWidth = displayMetrics.widthPixels;
        int screenHeight = displayMetrics.heightPixels;
        
        // Use 1/2 of screen size for most images to save memory
        return new int[] { screenWidth / 2, screenHeight / 2 };
    }
} 