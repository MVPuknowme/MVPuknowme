import SwiftUI

struct DarkBlueOrangeChatWidget: View {
    let title: String
    let status: String
    let lastMessage: String
    let unreadCount: Int

    init(
        title: String = "Aura Chat",
        status: String = "Online",
        lastMessage: String = "System synced. Revenue audit remains blocked pending payout verification.",
        unreadCount: Int = 3
    ) {
        self.title = title
        self.status = status
        self.lastMessage = lastMessage
        self.unreadCount = unreadCount
    }

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color(red: 0.04, green: 0.09, blue: 0.22), Color(red: 0.08, green: 0.15, blue: 0.36)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            VStack(alignment: .leading, spacing: 12) {
                HStack(spacing: 10) {
                    ZStack {
                        Circle()
                            .fill(Color.orange.opacity(0.22))
                            .frame(width: 40, height: 40)
                        Image(systemName: "message.fill")
                            .foregroundStyle(.orange)
                    }

                    VStack(alignment: .leading, spacing: 2) {
                        Text(title)
                            .font(.headline)
                            .foregroundStyle(.white)
                        Text(status)
                            .font(.caption)
                            .foregroundStyle(Color.orange)
                    }

                    Spacer()

                    if unreadCount > 0 {
                        Text("\(unreadCount)")
                            .font(.caption2.bold())
                            .foregroundStyle(.white)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 5)
                            .background(
                                Capsule().fill(Color.orange)
                            )
                    }
                }

                VStack(alignment: .leading, spacing: 8) {
                    Text("Latest")
                        .font(.caption.weight(.semibold))
                        .foregroundStyle(Color.white.opacity(0.72))

                    Text(lastMessage)
                        .font(.footnote)
                        .foregroundStyle(.white)
                        .lineLimit(3)
                }
                .padding(12)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .fill(Color.white.opacity(0.08))
                        .overlay(
                            RoundedRectangle(cornerRadius: 16, style: .continuous)
                                .stroke(Color.orange.opacity(0.35), lineWidth: 1)
                        )
                )

                HStack {
                    Label("Secure", systemImage: "lock.fill")
                    Spacer()
                    Label("Chat", systemImage: "arrow.up.left.and.arrow.down.right")
                }
                .font(.caption)
                .foregroundStyle(Color.white.opacity(0.82))
            }
            .padding(16)
        }
        .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 22, style: .continuous)
                .stroke(Color.orange.opacity(0.28), lineWidth: 1)
        )
        .shadow(color: Color.black.opacity(0.25), radius: 12, x: 0, y: 8)
    }
}

#Preview {
    DarkBlueOrangeChatWidget()
        .padding()
        .background(Color.black)
}
