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
        
        // Ensure the message body is a dictionary
        guard let messageDict = message.body as? [String: Any] else {
            print("Message body is not a dictionary. Received: \(message.body)")
            return
        }
        
        // Extract the event_id and data fields from the dictionary
        guard let eventId = messageDict["event_id"] as? String else {
            print("Message does not contain a valid 'event_id'. Received: \(messageDict)")
            return
        }
        
        // Check if data is a string or a dictionary (object)
        var data: String? = nil
        if let dataDict = messageDict["data"] as? [String: Any] {
            // Convert dictionary to string if needed
            if let jsonData = try? JSONSerialization.data(withJSONObject: dataDict, options: []),
            let jsonString = String(data: jsonData, encoding: .utf8) {
                data = jsonString
            } else {
                print("Failed to serialize 'data' to JSON string. Received: \(dataDict)")
                return
            }
        } else if let dataString = messageDict["data"] as? String {
            data = dataString
        } else {
            print("Message does not contain a valid 'data' field. Received: \(messageDict)")
            return
        }
        
        // Log the event_id and data for debugging
        print("Event ID: \(eventId), Data: \(data ?? "No data")")
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        iframeLoaded = true
        activityIndicator.stopAnimating()
    }
    
}
