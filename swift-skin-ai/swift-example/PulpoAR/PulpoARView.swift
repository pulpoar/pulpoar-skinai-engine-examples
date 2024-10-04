import UIKit
import SwiftUI
import WebKit


class PulpoARView: UIViewController, WKScriptMessageHandler, WKNavigationDelegate {
    
    private var webView: WKWebView!
    private var activityIndicator: UIActivityIndicatorView!
    private var iframeLoaded = false
    
    init() {
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupWebView()
        setupActivityIndicator()
        loadWebView()
    }
    
    private func setupWebView() {
        let contentController = WKUserContentController()
        contentController.add(self, name: "jsHandler")
        
        let config = WKWebViewConfiguration()
        config.userContentController = contentController
        config.allowsAirPlayForMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        
        webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = self
        webView.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(webView)
        
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor)
        ])
    }
    
    private func setupActivityIndicator() {
        activityIndicator = UIActivityIndicatorView(style: .large)
        activityIndicator.translatesAutoresizingMaskIntoConstraints = false
        activityIndicator.hidesWhenStopped = true
        view.addSubview(activityIndicator)
        
        NSLayoutConstraint.activate([
            activityIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            activityIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
    
    private func loadWebView() {
        let basePluginUrl = "https://booster.pulpoar.com/engine/v0/"
        let templateId = "65d729ee-163c-4c53-b9a8-2a5314bf1caa"
        let urlString = basePluginUrl + templateId
        guard let url = URL(string: urlString) else { return }
        
        let request = URLRequest(url: url)
        webView.load(request)
        activityIndicator.startAnimating()
    }
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.name == "jsHandler" else {
            print("Received message from unknown handler: \(message.name)")
            return
        }
        guard let messageDict = message.body as? [String: Any] else {
            print("Message body is not a dictionary. Received: \(message.body)")
            return
        }
        guard let messageString = messageDict["message"] as? String else {
            print("Message format incorrect. Expected a 'message' key with a string value. Received: \(messageDict)")
            return
        }
        handlePostMessage(messageString)
    }

    private func handlePostMessage(_ message: String) {
        let parts = message.components(separatedBy: " | ")
        // Validate that we have exactly two parts: event_id and data
        guard parts.count == 2 else {
            print("Invalid message format: expected 'event_id:XYZ | data:ABC'. Received: \(message)")
            return
        }
        // Further split and validate event_id and data
        let eventIdPart = parts[0].split(separator: ":")
        let dataPart = parts[1].split(separator: ":")

        guard eventIdPart.count == 2, dataPart.count == 2 else {
            print("Invalid key-value pair in message. Expected 'event_id:XYZ | data:ABC'. Received: \(message)")
            return
        }

        // Extract event_id and data
        let eventId = eventIdPart.last?.trimmingCharacters(in: .whitespaces)
        let data = dataPart.last?.trimmingCharacters(in: .whitespaces)

        guard let validEventId = eventId, let validData = data else {
            print("Failed to extract event_id or data from message. Received: \(message)")
            return
        }

        print("Event ID: \(validEventId), Data: \(validData)")
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        iframeLoaded = true
        activityIndicator.stopAnimating()
    }
    
}
