// Define your SwiftUI wrapper for the view controller

import WebKit
import SwiftUI

struct PulpoARViewRepresentable: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> PulpoARView {
        return PulpoARView()
    }
    
    func updateUIViewController(_ uiViewController: PulpoARView, context: Context) {
        // Update the view controller if needed
    }
}
