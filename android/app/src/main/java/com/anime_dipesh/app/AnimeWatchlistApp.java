package com.anime_dipesh.app;

import android.app.Application;
import android.content.Context;
import android.os.Build;
import android.os.StrictMode;
import android.webkit.WebView;
import androidx.multidex.MultiDex;

/**
 * Custom Application class for app-wide optimizations
 */
public class AnimeWatchlistApp extends Application {
    
    @Override
    public void onCreate() {
        super.onCreate();
        
        // Apply optimizations for smaller app size and better performance
        applyOptimizations();
    }
    
    private void applyOptimizations() {
        // Initialize WebView early to avoid delays when first showing UI
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WebView.setDataDirectorySuffix("minimal_webview");
        }
        
        // Pre-initialize WebView to avoid delay when first shown
        new Thread(() -> {
            try {
                // Initialize WebView on a background thread
                WebView webView = new WebView(this);
                webView.layout(0, 0, 1, 1);
                
                // Clean up immediately
                webView.destroy();
            } catch (Exception e) {
                // Ignore errors during pre-initialization
            }
        }).start();
        
        // Apply strict mode in debug builds only
        if (BuildConfig.DEBUG) {
            StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder()
                .detectAll()
                .penaltyLog()
                .build());
            
            StrictMode.setVmPolicy(new StrictMode.VmPolicy.Builder()
                .detectLeakedSqlLiteObjects()
                .detectLeakedClosableObjects()
                .penaltyLog()
                .build());
        } else {
            // Disable StrictMode in release builds for better performance
            StrictMode.setThreadPolicy(StrictMode.ThreadPolicy.LAX);
            StrictMode.setVmPolicy(StrictMode.VmPolicy.LAX);
        }
        
        // Initialize ResourceOptimizer
        ResourceOptimizer.init(this);
    }
    
    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        
        // Enable MultiDex if needed for older devices
        MultiDex.install(this);
    }
    
    @Override
    public void onTrimMemory(int level) {
        super.onTrimMemory(level);
        
        // Clear caches when memory is low
        if (level >= TRIM_MEMORY_MODERATE) {
            ResourceOptimizer.clearCache();
            WebView.clearCache(true);
        }
    }
    
    @Override
    public void onLowMemory() {
        super.onLowMemory();
        
        // Clear all caches when system is low on memory
        ResourceOptimizer.clearCache();
        WebView.clearCache(true);
        System.gc();
    }
} 