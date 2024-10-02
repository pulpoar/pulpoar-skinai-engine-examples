package com.pulpolabs.kotlin_example

import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.PermissionRequest
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import org.json.JSONObject
import android.webkit.JavascriptInterface


/**
 * A simple [Fragment] subclass.
 * Use the [PulpoARFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class PulpoARFragment : Fragment() {
    private var uploadMessage: ValueCallback<Array<Uri>>? = null
    private lateinit var webView: WebView
    private var CAMERA_PERMISSION_CODE = 200
    private val FILE_CHOOSER_RESULT_CODE = 1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        requestCameraPermission()
        val view = inflater.inflate(R.layout.fragment_web_view, container, false)
        webView = view.findViewById(R.id.webView)
        initializeWebView()

        return view
    }

    private fun initializeWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            mediaPlaybackRequiresUserGesture = false
            domStorageEnabled = true
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest) {
                request.grant(request.resources)
            }

            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                uploadMessage = filePathCallback

                val pickIntent = Intent(Intent.ACTION_GET_CONTENT)
                pickIntent.type = "image/*"
                pickIntent.addCategory(Intent.CATEGORY_OPENABLE)

                val chooserIntent = Intent(Intent.ACTION_CHOOSER)
                chooserIntent.putExtra(Intent.EXTRA_INTENT, pickIntent)
                chooserIntent.putExtra(Intent.EXTRA_TITLE, "Select Source")

                startActivityForResult(chooserIntent, FILE_CHOOSER_RESULT_CODE)
                return true
            }
        }

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)

                // Add a JavaScript interface to receive postMessages
                webView.evaluateJavascript("""
                    window.addEventListener('message', function(event) {
                        window.AndroidInterface.onMessageReceived(event.data);
                    });
                """.trimIndent(), null)
            }
        }

        // Add a JavaScript interface to handle postMessages
        webView.addJavascriptInterface(object : Any() {
            @JavascriptInterface
            fun onMessageReceived(message: String) {
                activity?.runOnUiThread {
                    handlePostMessage(message)
                }
            }
        }, "AndroidInterface")

        webView.loadUrl(PLUGIN_URL)
    }

    private fun handlePostMessage(message: String) {
        try {
            // Log the raw message
            Log.d("PulpoARFragment", "Received postMessage: $message")

            // Parse the message
            val parts = message.split(" | ")
            if (parts.size == 2) {
                val eventId = parts[0].substringAfter("event_id:")
                val data = parts[1].substringAfter("data:")

                // Log the parsed message
                Log.d("PulpoARFragment", "Event ID: $eventId, Data: $data")
            } else {
                Log.e("PulpoARFragment", "Invalid message format: $message")
            }
        } catch (e: Exception) {
            Log.e("PulpoARFragment", "Error parsing postMessage: ${e.message}")
        }
    }

    companion object {
        private const val BASE_PLUGIN_URL = "https://booster.pulpoar.com/engine/v0/"
        private const val TEMPLATE_ID = "65d729ee-163c-4c53-b9a8-2a5314bf1caa"
        private val PLUGIN_URL = BASE_PLUGIN_URL + TEMPLATE_ID

        @JvmStatic
        fun newInstance(param1: String, param2: String) =
            PulpoARFragment().apply {
                arguments = Bundle().apply {
                }
            }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == FILE_CHOOSER_RESULT_CODE && resultCode == Activity.RESULT_OK) {
            val results = data?.data?.let { arrayOf(it) }
            uploadMessage?.onReceiveValue(results)
            uploadMessage = null
        } else {
            uploadMessage?.onReceiveValue(null)
            uploadMessage = null
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        if (requestCode == CAMERA_PERMISSION_CODE) {
            if ((grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED)) {
                // Permission granted, access the camera
            }
        }
    }

    private fun requestCameraPermission() {
        if (ContextCompat.checkSelfPermission(requireContext(), android.Manifest.permission.CAMERA)
            != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                requireActivity(),
                arrayOf(
                    android.Manifest.permission.CAMERA,
                    android.Manifest.permission_group.CAMERA
                ),
                CAMERA_PERMISSION_CODE
            )
        }
    }
}