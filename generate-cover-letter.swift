import AppKit
import CoreGraphics

let output = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
    .appendingPathComponent("assets/Mukesh_Bhandari_ThemeGrill_Cover_Letter.pdf")

var mediaBox = CGRect(x: 0, y: 0, width: 595, height: 842) // A4
guard let consumer = CGDataConsumer(url: output as CFURL),
      let context = CGContext(consumer: consumer, mediaBox: &mediaBox, nil) else {
    fatalError("Unable to create PDF")
}

context.beginPDFPage(nil)
context.saveGState()
context.translateBy(x: 0, y: mediaBox.height)
context.scaleBy(x: 1, y: -1)
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(cgContext: context, flipped: true)

NSColor.white.setFill()
NSBezierPath(rect: mediaBox).fill()

let ink = NSColor(calibratedWhite: 0.12, alpha: 1)
let muted = NSColor(calibratedWhite: 0.38, alpha: 1)
let accent = NSColor(calibratedRed: 0.12, green: 0.30, blue: 0.48, alpha: 1)
let left: CGFloat = 62
let width: CGFloat = 471

func style(font: NSFont, color: NSColor = ink, spacing: CGFloat = 0,
           lineHeight: CGFloat = 0) -> [NSAttributedString.Key: Any] {
    let paragraph = NSMutableParagraphStyle()
    paragraph.paragraphSpacing = spacing
    paragraph.lineBreakMode = .byWordWrapping
    if lineHeight > 0 {
        paragraph.minimumLineHeight = lineHeight
        paragraph.maximumLineHeight = lineHeight
    }
    return [.font: font, .foregroundColor: color, .paragraphStyle: paragraph]
}

func draw(_ text: String, x: CGFloat = left, y: CGFloat, w: CGFloat = width,
          font: NSFont, color: NSColor = ink, lineHeight: CGFloat = 0) {
    NSAttributedString(string: text, attributes: style(font: font, color: color,
                                                       lineHeight: lineHeight))
        .draw(with: CGRect(x: x, y: y, width: w, height: 300),
              options: [.usesLineFragmentOrigin, .usesFontLeading])
}

draw("MUKESH BHANDARI", y: 52,
     font: NSFont.systemFont(ofSize: 22, weight: .bold), color: accent)
draw("WEB DEVELOPER", y: 80,
     font: NSFont.systemFont(ofSize: 9.5, weight: .semibold), color: muted)

let contact = "Kathmandu, Nepal   |   +977 9818785731   |   tamishbhandari2074@gmail.com\ngithub.com/muku10"
draw(contact, y: 104, font: NSFont.systemFont(ofSize: 9.5), color: muted,
     lineHeight: 15)

accent.setFill()
NSBezierPath(rect: CGRect(x: left, y: 142, width: width, height: 1.5)).fill()

draw("29 August 2026", y: 165, font: NSFont.systemFont(ofSize: 10.5))
draw("Hiring Team\nThemeGrill\nKathmandu, Nepal", y: 194,
     font: NSFont.systemFont(ofSize: 10.5), lineHeight: 15)

draw("Dear Hiring Team,", y: 257,
     font: NSFont.systemFont(ofSize: 10.5, weight: .semibold))

let paragraphs = [
    "I was excited to see your opening for a Mid-Level WordPress Developer because it feels like a natural next step for me. I enjoy building with WordPress, and I am especially interested in moving deeper into product development—creating and improving themes and plugins that solve real problems for a large number of users.",
    "I currently work as a Mid-Level WordPress and Laravel Developer at Codeilo Solutions. My day-to-day work includes building and maintaining WordPress and WooCommerce websites using PHP, JavaScript, and MySQL. I have delivered projects for businesses including Oud Al Khoori, Perfect Pets UAE, ACube Industries, Wood Plus, Top Himalaya Guides, and Lucent Hire. Each one has taught me how to understand different business needs, find practical solutions, and create websites that are reliable and easy to use.",
    "My experience also includes developing a Laravel-based reporting platform for Prabhu Insurance, with data imports, validation, filters, analytics, and CSV exports. That project strengthened my ability to work with complex data, debug difficult issues, and write code with security and maintainability in mind.",
    "What attracts me most to ThemeGrill is the opportunity to work on WordPress products used by people around the world. I would be glad to contribute my experience with PHP, WordPress, WooCommerce, JavaScript, React, MySQL, REST APIs, and Git while learning from a team with deep knowledge of the WordPress ecosystem. I work comfortably on my own, but I also value honest feedback, clear communication, and sharing ideas with a team.",
    "I genuinely enjoy learning and becoming a better developer. I would welcome the opportunity to bring my experience, curiosity, and problem-solving mindset to ThemeGrill and help build products your users can depend on.",
    "Thank you for taking the time to review my application. I would be happy to discuss my experience and projects with you."
]

var y: CGFloat = 290
let bodyFont = NSFont.systemFont(ofSize: 10.35)
for paragraph in paragraphs {
    let attributed = NSAttributedString(string: paragraph,
        attributes: style(font: bodyFont, lineHeight: 14.3))
    let bounds = attributed.boundingRect(with: NSSize(width: width, height: 500),
        options: [.usesLineFragmentOrigin, .usesFontLeading])
    attributed.draw(with: CGRect(x: left, y: y, width: width,
                                 height: ceil(bounds.height) + 2),
                    options: [.usesLineFragmentOrigin, .usesFontLeading])
    y += ceil(bounds.height) + 11
}

draw("Sincerely,", y: y + 3, font: NSFont.systemFont(ofSize: 10.5))
draw("Mukesh Bhandari", y: y + 31,
     font: NSFont.systemFont(ofSize: 11, weight: .semibold), color: accent)

NSGraphicsContext.restoreGraphicsState()
context.restoreGState()
context.endPDFPage()
context.closePDF()

print(output.path)
