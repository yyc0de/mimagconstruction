// ================================================================
// MIMAG WEBSITE — EASY-EDIT COMPANY DATA
// ================================================================
// Edit the sections below when company information changes.
// You normally do NOT need to edit index.html or main.js.
//
// PROJECTS:
//   title       = project name
//   category    = building | industrial | mepf
//   location    = project location
//   cost        = documented project value
//   description = documented scope
//   folder      = folder under assets/images/projects/ containing the project photos
//                 Every image file inside that folder is automatically included in the gallery.
//   status      = completed | ongoing
//
// CERTIFICATIONS:
//   title = certificate / registration name
//   image = path to the actual certificate image
// ================================================================

const COMPANY = {
  name: "MIMAG Construction & Trading Corporation",
  email: "mimag.gencon@gmail.com",
  phones: ["+63 927 388 3486", "+63 991 736 7724"],
  address: "Lot 1, Block 1, Phase 2, La Trevi Estate, Sta. Monica, San Simon, Pampanga 2015",
  facebook: "",
  linkedin: "",
  website: ""
};

// ================================
// EDIT PROJECTS HERE
// ================================
const projects = [
  {
    title: "3-Storey Residential Building",
    folder: "3-Storey Residential Building",
    category: "building",
    status: "completed",
    location: "Brgy. Sta. Monica, San Simon, Pampanga",
    cost: "Php 8,500,000",
    description: "Construction from foundation to roofing, including Electrical, Plumbing and Finishing Works."
  },
  {
    title: "3-Storey Residential Building with Penthouse",
    folder: "3-Storey Residential Building with Penthouse",
    category: "building",
    status: "completed",
    location: "Santa Ana, Manila",
    cost: "Php 10,000,000",
    description: "Construction from foundation work to roofing, including Electrical, Plumbing and Finishing Works."
  },
  {
    title: "Three-Bedroom Bungalow Residential Building",
    folder: "Three-Bedroom Bungalow Residential Building",
    category: "building",
    status: "completed",
    location: "Brgy. Sta. Monica, San Simon, Pampanga",
    cost: "Php 6,000,000",
    description: "Construction from foundation to roofing, including Electrical, Plumbing and Finishing Works."
  },
  {
    title: "3-Storey Multi-Purpose Church Building",
    folder: "3-Storey Multi-Purpose Church Building",
    category: "building",
    status: "completed",
    location: "Brgy. Halang, Cambacita, Laguna",
    cost: "Php 9,750,000",
    description: "Construction from foundation to roofing, including rough-in for Electrical and Plumbing Works."
  },
  {
    title: "Pagsikat Place Housing",
    folder: "Pagsikat Place Housing",
    category: "building",
    status: "completed",
    location: "Brgy. Catmon, Sta. Maria, Bulacan",
    cost: "Php 6,000,000",
    description: "Complete package 2-storey housing, from Civil / Structural Works down to MEP (Labor Only)."
  },
  {
    title: "Oxygen Plant Maintenance Work — PASAR",
    folder: "Oxygen Plant Maintenance Work - PASAR",
    category: "industrial",
    status: "completed",
    location: "Lide, Isabel, Leyte",
    cost: "Php 8,597,473.80",
    description: "Electro-Mechanical Maintenance Work."
  },
  {
    title: "Electrical Unitized for Interim Repair and Short Outage — 2025",
    folder: "Electrical Unitized for Interim Repair and Short Outage - 2025",
    category: "industrial",
    status: "completed",
    location: "Alasasin, Mariveles, Bataan",
    cost: "Php 6,328,000",
    description: "Inspection and cleaning, repair and maintenance of electrical equipment."
  },
  {
    title: "Lapid Arena — Fire Protection System",
    folder: "Lapid Arena - Fire Protection System",
    category: "mepf",
    status: "completed",
    location: "Angeles City, Pampanga",
    cost: "Php 7,050,737.78",
    description: "Design and installation of complete Fire Protection System."
  },
  {
    title: "Installation of Electromagnetic Separator — GNPower Mariveles",
    folder: "Installation of Electromagnetic Separator - GNPower Mariveles",
    category: "industrial",
    status: "completed",
    location: "Alasasin, Mariveles, Bataan",
    cost: "Php 919,107.84",
    description: "Disassembling of existing unit and installation of new one."
  },
  {
    title: "Installation of Isolating Valves on U2 Generator Hydrogen Drier",
    folder: "Installation of Isolating Valves on U2 Generator Hydrogen Drier",
    category: "mepf",
    status: "completed",
    location: "Alasasin, Mariveles, Bataan",
    cost: "Php 404,320",
    description: "Supply and installation of isolating valves."
  },
  {
    title: "TPAC Philippines Packaging - Enclosed Cabin",
    folder: "TPAC Philippines Packaging - Enclosed Cabin",
    category: "building",
    status: "completed",
    location: "Global Park, San Simon, Pampanga",
    cost: "Php 3,200,000.00",
    description: "Construction of Enclosed Cabin."
  }
];

// ============================================================
// EDIT REGISTRATIONS & ACCREDITATIONS HERE
// These are rendered from the actual certificate/document pages
// extracted from the latest supplied Company Profile PDF.
// To add/remove one: add/delete one object below.
// To replace one: change only its image path.
// ============================================================
const certifications = [
  { title: "SEC Certificate of Incorporation", image: "assets/images/certificates/30-sec-certificate-of-incorporation.jpg" },
  { title: "SEC Certificate of Approval of Increase of Capital Stock", image: "assets/images/certificates/31-sec-certificate-of-approval-of-increase-of-capital-stock.jpg" },
  { title: "SEC Certificate of Filing", image: "assets/images/certificates/32-sec-certificate-of-filing.jpg" },
  { title: "BIR Certificate of Registration (Form 2303)", image: "assets/images/certificates/33-bir-certificate-of-registration-form-2303.jpg" },
  { title: "SSS Certificate of Registration", image: "assets/images/certificates/34-sss-certificate-of-registration.jpg" },
  { title: "PhilHealth Employer Registration / Certification", image: "assets/images/certificates/35-philhealth-employer-registration-certification.jpg" },
  { title: "SSS Employer Data Form", image: "assets/images/certificates/36-sss-employer-data-form.jpg" },
  { title: "PPA Certificate of Accreditation", image: "assets/images/certificates/37-ppa-certificate-of-accreditation.jpg" },
  { title: "PPA Permit to Operate", image: "assets/images/certificates/38-ppa-permit-to-operate.jpg" },
  { title: "Asian Terminals Inc. Accreditation Certificate", image: "assets/images/certificates/39-asian-terminals-inc-accreditation-certificate.jpg" },
  { title: "Raemulan Lands, Inc. Notice of Accreditation", image: "assets/images/certificates/40-raemulan-lands-inc-notice-of-accreditation.jpg" },
  { title: "Barangay Clearance", image: "assets/images/certificates/41-barangay-clearance.jpg" },
  { title: "San Simon Business Permit", image: "assets/images/certificates/42-san-simon-business-permit.jpg" },
  { title: "PCAB Regular Contractor's License", image: "assets/images/certificates/43-pcab-regular-contractor-s-license.jpg" },
  { title: "PhilGEPS Platinum Membership Certificate", image: "assets/images/certificates/44-philgeps-platinum-membership-certificate.jpg" },
  { title: "DOLE Occupational Safety and Health Standards Certificate of Registration", image: "assets/images/certificates/45-dole-occupational-safety-and-health-standards-certificate-of-registration.jpg" },
  { title: "DOLE Certificate of Registration", image: "assets/images/certificates/46-dole-certificate-of-registration.jpg" },
  { title: "DOLE Rule 1020 Certificate of Registration", image: "assets/images/certificates/47-dole-rule-1020-certificate-of-registration.jpg" },
  { title: "DOLE Certification of No Pending Case", image: "assets/images/certificates/48-dole-certification-of-no-pending-case.jpg" }
];
