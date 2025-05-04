package com.anime_dipesh.app;

import android.content.Context;
import android.graphics.Color;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.getcapacitor.BridgeWebView;

public class OptimizedWebView extends BridgeWebView {
    public OptimizedWebView(Context context) {
        super(context);
        optimize();
    }

    /**
     * Applies optimizations to reduce memory usage and improve performance
     */
    private void optimize() {
        WebSettings settings = getSettings();
        
        // Disable features that consume extra memory
        settings.setGeolocationEnabled(false);
        settings.setSaveFormData(false);
        settings.setSavePassword(false);
        settings.setAppCacheEnabled(false);
        settings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK); // Use cache when available
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setLoadsImagesAutomatically(true);
        settings.setBlockNetworkImage(false);
        settings.setBlockNetworkLoads(false);
        settings.setDatabaseEnabled(false);
        settings.setDomStorageEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        
        // Additional optimizations
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setDefaultTextEncodingName("UTF-8");
        settings.setSupportZoom(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setAllowFileAccessFromFileURLs(false);
        
        // Optimize for speed vs memory
        settings.setRenderPriority(WebSettings.RenderPriority.HIGH);
        
        // Set transparent background to avoid extra rendering
        setBackgroundColor(Color.TRANSPARENT);
        
        // Disable hardware acceleration for text
        settings.setDefaultFontSize(16);
        settings.setDefaultFixedFontSize(14);
        
        // Disable selection controls
        settings.setSupportMultipleWindows(false);
        
        if (!BuildConfig.DEBUG) {
            // Release-only optimizations
            setWebContentsDebuggingEnabled(false);
            
            // Use aggressive caching in production
            settings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
            
            // Disable console messages in release build
            setWebChromeClient(new MinimalWebChromeClient());
        }
        
        // Enable low-memory optimizations 
        if (isLowEndDevice()) {
            // Software rendering is more memory efficient, but slower
            setLayerType(LAYER_TYPE_SOFTWARE, null);
        } else {
            // Better performance but uses more memory
            setLayerType(LAYER_TYPE_HARDWARE, null);
        }
    }
    
    /**
     * Checks if this is likely a low-end device based on available memory
     */
    private boolean isLowEndDevice() {
        // Get available memory
        try {
            Runtime runtime = Runtime.getRuntime();
            long maxMemory = runtime.maxMemory() / (1024 * 1024); // Convert to MB
            // If less than 64MB max memory, consider it a low-end device
            return maxMemory < 64;
        } catch (Exception e) {
            // If we can't determine, assume it's a low-end device to be safe
            return true;
        }
    }
    
    /**
     * Minimal WebChromeClient that suppresses console messages
     */
    private static class MinimalWebChromeClient extends WebChromeClient {
        @Override
        public boolean onConsoleMessage(android.webkit.ConsoleMessage consoleMessage) {
            // Suppress console messages in release mode
            return true;
        }
    }
    
    @Override
    public void onPause() {
        super.onPause();
        // Pause WebView when not visible
        pauseTimers();
    }
    
    @Override
    public void onResume() {
        super.onResume();
        // Resume WebView when visible again
        resumeTimers();
    }
    
    /**
     * Call this when the activity is destroyed to clean up memory
     */
    public void cleanup() {
        clearHistory();
        clearCache(true);
        clearFormData();
        clearSslPreferences();
        clearView();
        removeAllViews();
        destroyDrawingCache();
    }
} 