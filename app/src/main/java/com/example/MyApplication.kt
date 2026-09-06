package com.example

import android.app.Application
import android.content.Context
import android.os.Build
import android.system.Os

class MyApplication : Application() {
  companion object {
    init {
      configureGraphicsEnvironment()
    }

    private fun configureGraphicsEnvironment() {
      try {
        Os.setenv("MESA_LOG_FILE", "/dev/null", true)
        Os.setenv("MESA_LOG_LEVEL", "none", true)
        Os.setenv("EGL_LOG_LEVEL", "none", true)
        Os.setenv("MESA_DEBUG", "0", true)
        Os.setenv("MESA_SILENT", "1", true)
        Os.setenv("MESA_VERBOSE", "quiet", true)
        Os.setenv("LIBGL_DEBUG", "quiet", true)
        Os.setenv("LIBGL_ALWAYS_SOFTWARE", "1", true)
        Os.setenv("MESA_NO_ERROR", "1", true)
        Os.setenv("GALLIUM_DRIVER", "softpipe", true)
        Os.setenv("MESA_LOADER_DRIVER_OVERRIDE", "swrast", true)
        Os.setenv("VK_ICD_FILENAMES", "", true)
      } catch (_: Throwable) {}
    }
  }

  override fun attachBaseContext(base: Context?) {
    configureGraphicsEnvironment()
    super.attachBaseContext(base)
  }

  override fun onCreate() {
    configureGraphicsEnvironment()
    super.onCreate()
  }
}
