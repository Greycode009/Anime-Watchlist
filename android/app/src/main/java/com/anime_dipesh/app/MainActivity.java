package com.anime_dipesh.app;

import android.os.Bundle;
import android.view.WindowManager;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Initialize resource optimizer
        ResourceOptimizer.init(this);
        
        // Enable hardware acceleration but set lower quality for drawing to save memory
        if (!BuildConfig.DEBUG) {
            // Lower window drawing quality in production for better performance
            getWindow().setFlags(
                WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
                WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED
            );
        }
        
        // Set custom WebView factory to use our optimized WebView
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
        
        // Disable hardware acceleration for the activity in release mode
        // to reduce memory usage on low-end devices
        if (!BuildConfig.DEBUG) {
            getWindow().setHardwareAccelerated(false);
        }
        
        super.onCreate(savedInstanceState);
        
        // Trim memory when app starts
        trimMemory();
    }
    
    @Override
    public WebView createWebView() {
        return new OptimizedWebView(this);
    }
    
    @Override
    public void onPause() {
        super.onPause();
        // Pause WebView when app is in background to save memory
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().onPause();
            
            // Reduce memory usage in background
            trimMemory();
        }
    }
    
    @Override
    public void onResume() {
        super.onResume();
        // Resume WebView when app comes to foreground
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().onResume();
        }
    }
    
    @Override
    public void onTrimMemory(int level) {
        super.onTrimMemory(level);
        trimMemory();
    }
    
    @Override
    public void onLowMemory() {
        super.onLowMemory();
        trimMemory();
    }
    
    private void trimMemory() {
        // Force garbage collection
        System.gc();
        
        // Clear WebView caches
        WebView.clearCache(true);
        
        // Clear bitmap caches
        ResourceOptimizer.clearCache();
    }
    
    @Override
    public void onDestroy() {
        // Clean up WebView resources
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();
            
            // Use our enhanced cleanup if it's our OptimizedWebView
            if (webView instanceof OptimizedWebView) {
                ((OptimizedWebView) webView).cleanup();
            } else {
                webView.destroy();
            }
            
            // Set to null to help GC
            getBridge().setWebView(null);
        }
        
        // Clear resource caches
        ResourceOptimizer.clearCache();
        
        super.onDestroy();
    }
}
