//
//  SwiftExampleApp.swift
//  swift-example
//
//  Created by Emre Erdem on 12/10/2024.
//

import SwiftUI

@main
struct SwiftExampleApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

struct ContentView: View {
    var body: some View {
        PulpoARViewRepresentable()
    }
}
