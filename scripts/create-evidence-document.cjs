const fs = require("node:fs");
const path = require("node:path");
const {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Footer,
  HeadingLevel,
  ImageRun,
  PageBreak,
  PageNumber,
  PageOrientation,
  Paragraph,
  Packer,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} = require("docx");

const root = path.resolve(__dirname, "..");
const evidenceDirectory = path.join(root, "docs", "evidence");
const outputPath = path.join(root, "..", "ZohaibSyed_COMP229_Assignment2_Evidence.docx");
const contentWidth = 14400;
const border = { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" };
const borders = { top: border, bottom: border, left: border, right: border };

const evidence = [
  ["Contact API Testing", "Detailed terminal evidence shows every required contact CRUD request, submitted JSON, HTTP status, and returned JSON response.", "01-contacts-detailed.png", 330],
  ["Project API Testing", "Detailed terminal evidence shows every required project CRUD request, submitted JSON, HTTP status, and returned JSON response.", "02-projects-detailed.png", 330],
  ["Qualification API Testing", "Detailed terminal evidence shows every required qualification CRUD request, submitted JSON, HTTP status, and returned JSON response.", "03-qualifications-detailed.png", 330],
  ["User Routes and JWT Authentication", "Detailed terminal evidence shows user CRUD, sign-in, authenticated profile access, a rejected request without JWT, sign-out, and deletion. Password and token values are intentionally hidden.", "04-users-auth-detailed.png", 446],
  ["MongoDB Portfolio Database", "The VS Code terminal confirms the Portfolio database, all four required collections, their required fields, and representative documents. The stored password is excluded from the evidence.", "05-mongodb-fields.png", 244],
  ["Backend Welcome Message", "The browser displays the required root response from the running Express server at http://localhost:5001/.", "06-backend-browser.png", 217],
  ["Concurrent Frontend and Backend Startup", "The VS Code terminal shows the Next.js client and Express server starting concurrently, the MongoDB connection, and both local application addresses.", "05-concurrent-startup-terminal.png", 269],
  ["Final Automated Verification", "The final terminal run confirms eight API tests pass, frontend linting succeeds, TypeScript succeeds, and the production Next.js build completes.", "06-final-verification-terminal.png", 484],
];

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function evidencePage(title, description, filename, imageHeight, index) {
  return [
    pageBreak(),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun(`${index}. ${title}`)],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [new TextRun(description)],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new ImageRun({
        type: "png",
        data: fs.readFileSync(path.join(evidenceDirectory, filename)),
        transformation: { width: 920, height: imageHeight },
        altText: { title, description, name: filename },
      })],
    }),
  ];
}

function checklistRow(requirement, status, evidenceText, isHeader = false) {
  const fill = isHeader ? "17324D" : "F8FAFC";
  const color = isHeader ? "FFFFFF" : "172033";
  const values = [requirement, status, evidenceText];
  const widths = [5200, 1800, 7400];

  return new TableRow({
    children: values.map((value, index) => new TableCell({
      borders,
      width: { size: widths[index], type: WidthType.DXA },
      shading: { fill, type: ShadingType.CLEAR },
      verticalAlign: VerticalAlign.CENTER,
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      children: [new Paragraph({ children: [new TextRun({ text: value, bold: isHeader, color })] })],
    })),
  });
}

const children = [
  new Paragraph({
    spacing: { before: 900, after: 180 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "COMP229: Web Application Development", bold: true, size: 34, color: "17324D" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 260 },
    children: [new TextRun({ text: "Assignment 2 — Portfolio Backend", bold: true, size: 52 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 700 },
    children: [new TextRun({ text: "API Testing and MongoDB Evidence", size: 30, color: "3A6076" })],
  }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "Student", bold: true, color: "596579" })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 280 }, children: [new TextRun({ text: "Zohaib Syed", bold: true, size: 34 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "Repository", bold: true, color: "596579" })] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new ExternalHyperlink({
      link: "https://github.com/YaBoiZo/comp229-portfolio-assignment2",
      children: [new TextRun({ text: "github.com/YaBoiZo/comp229-portfolio-assignment2", style: "Hyperlink" })],
    })],
  }),
  pageBreak(),
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Implementation Summary")] }),
  new Paragraph({
    spacing: { after: 220 },
    children: [new TextRun("This project extends the Assignment 1 Next.js portfolio with a Node.js and Express REST API, MongoDB persistence through Mongoose, full CRUD operations, and JWT authentication. The portfolio contact form submits directly to the backend API. Automated integration tests validate every resource and the authentication flow.")],
  }),
  new Table({
    width: { size: contentWidth, type: WidthType.DXA },
    columnWidths: [5200, 1800, 7400],
    rows: [
      checklistRow("Assignment requirement", "Status", "Implementation evidence", true),
      checklistRow("Express backend and frontend connection", "Complete", "Concurrent root development command and Next.js backend rewrite."),
      checklistRow("MongoDB Portfolio database", "Complete", "Mongoose connection and four required collections."),
      checklistRow("Models, controllers, routes, and CRUD", "Complete", "Contacts, projects, qualifications, and users REST endpoints."),
      checklistRow("JWT authentication", "Complete", "Sign-in, sign-out, profile, token verification, and protected routes."),
      checklistRow("Automated verification", "Complete", "Eight integration tests, frontend lint, and production build all pass."),
      checklistRow("Version control", "Complete", "Public GitHub repository with a meaningful commit history."),
    ],
  }),
  new Paragraph({
    spacing: { before: 280 },
    children: [new TextRun({ text: "Testing note: ", bold: true }), new TextRun("API and database screenshots are clean VS Code terminal captures; the backend welcome response is a tightly cropped browser capture as required by the assignment. Evidence uses isolated test data and does not display passwords, JWT values, database credentials, or other secrets.")],
  }),
];

evidence.forEach((item, index) => children.push(...evidencePage(item[0], item[1], item[2], item[3], index + 1)));

const document = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22, color: "172033" } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: "Arial", size: 32, bold: true, color: "17324D" },
        paragraph: { spacing: { before: 80, after: 160 }, outlineLevel: 0 } },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840, orientation: PageOrientation.LANDSCAPE },
        margin: { top: 720, right: 720, bottom: 720, left: 720 },
      },
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun("Zohaib Syed — COMP229 Assignment 2     Page "), new TextRun({ children: [PageNumber.CURRENT] })],
      })] }),
    },
    children,
  }],
});

Packer.toBuffer(document).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(outputPath);
});
