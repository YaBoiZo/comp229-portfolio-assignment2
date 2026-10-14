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
  ["User Creation", "POST /api/users returns 201 Created. The password is accepted for registration but is not exposed in the response.", "01-user-create.png"],
  ["JWT Sign-In", "POST /api/auth/signin validates the user and returns a signed JSON Web Token with the user profile.", "02-jwt-signin.png"],
  ["Contacts Collection", "Authenticated GET /api/contacts returns the contact created during API testing.", "03-contacts-get-all.png"],
  ["Projects Collection", "GET /api/projects returns the Custom AI Chatbot project and all required model fields.", "04-projects-get-all.png"],
  ["Qualifications Collection", "GET /api/qualifications returns the Software Engineering Technology qualification and all required model fields.", "05-qualifications-get-all.png"],
  ["JWT Sign-Out", "POST /api/auth/signout clears the authentication cookie and confirms a successful sign-out.", "06-jwt-signout.png"],
  ["Protected Route Rejection", "GET /api/users without authentication returns 401 Unauthorized, demonstrating route protection.", "07-protected-route-unauthorized.png"],
  ["MongoDB Portfolio Database", "The local MongoDB Portfolio database contains contacts, projects, qualifications, and users collections, with one test document in each.", "08-mongodb-portfolio-database.png"],
  ["Automated Full CRUD Test Suite", "The integration suite verifies full CRUD and delete-all operations for contacts, projects, and qualifications; protected user CRUD; JWT sign-in; and unauthorized access. All eight tests pass.", "09-automated-crud-tests.png"],
];

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function evidencePage(title, description, filename, index) {
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
        transformation: { width: 920, height: 545 },
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
    children: [new TextRun({ text: "Testing note: ", bold: true }), new TextRun("The screenshots use a local MongoDB 8.0 service and Thunder Client 2.41.3. The JWT and password shown are demonstration credentials created only for this local assignment database.")],
  }),
];

evidence.forEach((item, index) => children.push(...evidencePage(item[0], item[1], item[2], index + 1)));

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
