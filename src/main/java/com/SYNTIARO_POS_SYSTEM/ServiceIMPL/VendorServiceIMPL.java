package com.SYNTIARO_POS_SYSTEM.ServiceIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.Vendor;

import com.SYNTIARO_POS_SYSTEM.Repository.VendorRepo;
import com.SYNTIARO_POS_SYSTEM.Response.VendorWrapper;
import com.SYNTIARO_POS_SYSTEM.Service.VendorService;
import com.itextpdf.text.Element;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class VendorServiceIMPL implements VendorService {
	private final VendorRepo vendorRepo;

	@Autowired
	public VendorServiceIMPL(VendorRepo vendorRepo) {
		this.vendorRepo = vendorRepo;
	}

	public Vendor createVendor(Vendor vendor) {
		Integer store_id = vendor.getStore_id();
		String vendor_name = vendor.getVendor_name();
		if (vendorRepo.existsByStoreIdAndVendorName(store_id, vendor_name)) {
			throw new RuntimeException("Vendor with the same name already exists in this store.");
		}
		return vendorRepo.save(vendor);
	}
	@Override
	public String addVendor(@RequestBody Vendor vendor) {
		Integer lastBillNumbers = vendorRepo.findMaxVendorIdByStoreId(vendor.getStore_id());
		System.out.println(vendor.getStore_id() +" store id");
		System.out.println(lastBillNumbers + " lastbill no");
		vendor.setVendor_id(lastBillNumbers != null ? lastBillNumbers + 1 : 1);
		vendorRepo.save(vendor);
		return vendor.getVendor_name();
	}
	@Override
	public List<Vendor> getVendors() {
		return vendorRepo.findAll();
	}
	@Override
	public Vendor updateVendor(Vendor vendor) {
		vendorRepo.save(vendor);
		return vendor;
	}
	public Vendor saveDetails(Vendor vendor) {
		return vendorRepo.save(vendor);

	}
	public Vendor getVendorDetailsById(int id) {
		return vendorRepo.findById((long) id).orElse(null);
	}
	@Override
	public List<Vendor> fetchVendorsBystoreId(Integer storeId) {
		return vendorRepo.findBystore_id(storeId);
	}


	@Override
	public Vendor getVendorDetailsById(Integer id) {
		return vendorRepo.findById((long) id).orElse(null);
	}


	// THIS METHOD IS USE FOR UPDATE VENDOR
	@Override
	public Vendor updateVendor(Integer vendor_id, Vendor vendor) {
		Optional<Vendor> existingVendor = vendorRepo.findById((long) Integer.parseInt(String.valueOf((vendor_id))));
		if (existingVendor.isPresent()) {
			Vendor updatevendor = existingVendor.get();

			if (vendor.getVendor_name() != null) {
				updatevendor.setVendor_name(vendor.getVendor_name());
			}
			if (vendor.getVendor_address() != null) {
				updatevendor.setVendor_address(vendor.getVendor_address());
			}
			if (vendor.getMobile_no() != null) {
				updatevendor.setMobile_no(vendor.getMobile_no());
			}
			if (vendor.getGst_no() != null) {
				updatevendor.setGst_no(vendor.getGst_no());
			}
			if (vendor.getUpdate_date() != null) {
				updatevendor.setUpdate_date(vendor.getUpdate_date());
			}
			if (vendor.getUpdate_by() != null) {
				updatevendor.setUpdate_by(vendor.getUpdate_by());
			}
			if (vendor.getCreated_date() != null) {
				updatevendor.setCreated_date(vendor.getCreated_date());
			}
			if (vendor.getCreated_by() != null) {
				updatevendor.setCreated_by(vendor.getCreated_by());
			}
			if (vendor.getStore_id() != null) {
				updatevendor.setStore_id(vendor.getStore_id());
			}
			if (vendor.getBank_name() != null) {
				updatevendor.setBank_name(vendor.getBank_name());
			}
			if (vendor.getBranch() != null) {
				updatevendor.setBranch(vendor.getBranch());
			}
			if (vendor.getAccount_no() != null) {
				updatevendor.setAccount_no(vendor.getAccount_no());
			}
			if (vendor.getIfsc_code() != null) {
				updatevendor.setIfsc_code(vendor.getIfsc_code());
			}
			if (vendor.getUpi_id() != null) {
				updatevendor.setUpi_id(vendor.getUpi_id());
			}
			if (vendor.getVendor_code() != null) {
				updatevendor.setVendor_code(vendor.getVendor_code());
			}
			vendorRepo.save(updatevendor);
			return updatevendor;
		} else {
			return null;
		}
	}
	public byte[] findByStoreId(Integer store_id) throws IOException {
		String[] headers = {"Vendor ID", "Vendor Name", "Vendor Address", "Mobile No", "GST No", "Bank Name", "Branch", "Account No", "IFSC Code", "UPI ID"};

		PDDocument document = new PDDocument();
		PDPage page = new PDPage(PDRectangle.A4);
		document.addPage(page);

		try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
			float margin = 50;
			float yStart = page.getMediaBox().getHeight() - margin;
			float tableWidth = page.getMediaBox().getWidth() - 2 * margin;
			float yPosition = yStart;
			float rowHeight = 20f;
			List<Vendor> vendorList = vendorRepo.findByStoreId(store_id);
			contentStream.setFont(PDType1Font.HELVETICA_BOLD, 6);
			float xPosition = margin;
			for (String header : headers) {
				contentStream.beginText();
				contentStream.newLineAtOffset(xPosition, yPosition - 15);
				contentStream.showText(header);
				contentStream.endText();
				xPosition += tableWidth / headers.length;
			}
			contentStream.setFont(PDType1Font.HELVETICA, 6);
			yPosition -= rowHeight;
			for (Vendor vendor : vendorList) {
				xPosition = margin;
				for (int i = 0; i < headers.length; i++) {
					String header = headers[i];
					String cellValue = getCellValue(vendor, header);
					contentStream.beginText();
					contentStream.newLineAtOffset(xPosition, yPosition - 15);
					contentStream.showText(cellValue);
					contentStream.endText();
					xPosition += tableWidth / headers.length; // Adjust the column width evenly
				}
				yPosition -= rowHeight;
			}
		}
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		document.save(outputStream);
		document.close();
		return outputStream.toByteArray();
	}
	private String getCellValue(Vendor vendor, String header) {
		if ("Vendor ID".equals(header)) {
			return String.valueOf(vendor.getVendor_id());
		} else if ("Vendor Name".equals(header)) {
			return vendor.getVendor_name();
		} else if ("Vendor Address".equals(header)) {
			return vendor.getVendor_address();
		} else if ("GST No".equals(header)) {
			return vendor.getGst_no();
		} else if ("Mobile No".equals(header)) {
			return String.valueOf(vendor.getMobile_no());
		} else if ("Bank Name".equals(header)) {
			return vendor.getBank_name();
		} else if ("Branch".equals(header)) {
			return vendor.getBranch();
		} else if ("Account No".equals(header)) {
			return String.valueOf(vendor.getAccount_no());
		} else if ("IFSC Code".equals(header)) {
			return vendor.getIfsc_code();
		} else if ("UPI ID".equals(header)) {
			return vendor.getUpi_id();
		}
		return "";
	}
}
