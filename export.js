const express = require("express");
const router = express.Router();
const Tema = require("../models/Tema");
const PDFDocument = require("pdfkit");
const { Document, Packer, Paragraph, TextRun } = require("docx");
const fs = require("fs");
const path = require("path");

// utilitários para semana e mês
function getWeeklyRange(date = new Date()) { /* ...conforme envio anterior... */ }
function getMonthlyRange(date = new Date()) { /* ...conforme envio anterior... */ }

async function getSlides(filterType) { /* ...conforme envio anterior... */ }

// PDF export
router.get("/pdf/:filter", async (req, res) => { /* ... */ });

// DOCX export
router.get("/docx/:filter", async (req, res) => { /* ... */ });

module.exports = router;
