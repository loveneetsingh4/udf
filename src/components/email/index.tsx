import { useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import instaLogo from "../../assets/insta.jpeg";
import gmailLogo from "../../assets/g2.jpg";
import xlogo from "../../assets/xlogo.jpeg";
import udfLogo from "../../assets/udf.jpeg";
import wlogo from "../../assets/wlogo.jpeg";
import moment from "moment";

const IDCardGenerator = ({ data }: any) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleDownload = async () => {
    if (!cardRef.current) {
      console.error("Card element not found");
      return;
    }

    try {
      const cardImgDataUrl = await toPng(cardRef.current);

      const pdf = new jsPDF({
        unit: "mm", // You can also use "px" or "cm" if needed
        format: [90, 60], // width: 180mm, height: 150mm (smaller than A4)
      });
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight =
        (cardRef.current.offsetHeight * imgWidth) / cardRef.current.offsetWidth;

      pdf.addImage(cardImgDataUrl, "PNG", 0, 0, imgWidth, imgHeight);

      pdf.save(`${data?.name.trim()}.pdf`);
    } catch (error) {
      console.error("Error generating the PDF:", error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleDownload();
    }, 500); // Wait 500ms for resources to load
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your UDF Card </h1>

      {/* Card Preview */}
      <div
        id="id-card"
        ref={cardRef}
        style={{
          width: "1000px",
          border: "1px solid #000",
          borderRadius: "10px",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "white",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "5px" }}>
            <img
              src={udfLogo}
              alt="Logo 1"
              style={{
                height: "110px", // Matches the header height
              
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            {/* Header section */}
            <div style={{ marginBottom: "15px" }}>
              <h1 style={{ fontSize: "48px", margin: "0" }}>
                UNITED DOCTORS FRONT (UDF)
              </h1>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "15px",
                  gap: "15px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={wlogo}
                    alt="wlogo"
                    style={{
                      width: "40px",
                      height: "40px",
                      marginRight: "5px",
                      borderRadius: "50%",
                    }}
                  />
                  <span>: www.udfa.in</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={xlogo}
                    alt="Logo 2"
                    style={{
                      width: "40px",
                      height: "40px",
                      marginRight: "5px",
                      borderRadius: "50%",
                    }}
                  />
                  <span>: @UDF_BHARAT</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={instaLogo}
                    alt="Logo 3"
                    style={{
                      width: "40px",
                      height: "40px",
                      marginRight: "5px",
                      borderRadius: "50%",
                    }}
                  />
                  <span>: @UDF_BHARAT</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={gmailLogo}
                    alt="Logo 4"
                    style={{
                      width: "40px",
                      height: "40px",
                      marginRight: "5px",
                    }}
                  />
                  <span>: udfindia2022@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              marginRight: "20px",
              width: "150px",
              height: "150px",
              overflow: "hidden",
            }}
          >
            <img
              src={data?.imageUrl}
              crossOrigin="anonymous"
              alt="Uploaded"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </div>

          <div
            style={{
              position: "relative",
              margin: "40px 90px",
              textAlign: "left",
              justifyContent: "center",
              fontSize: "18px", // Increased font size
            }}
          >
            {/* Logo with opacity */}
            <img
              src={udfLogo}
              alt="Logo"
              style={{
                position: "absolute",
              
                // top: "0",
                // left: "1%",
                right:"-164px",
                width: "180%",
                height: "95%",
                objectFit: "contain",
                opacity: "0.2",
                zIndex: "4000", // Ensures the logo is behind the text
              }}
            />
            {/* Content */}
            <p style={{ fontSize: "20px" }}>
              <strong>NAME:</strong> {data?.name || "John"}
            </p>
            <p style={{ fontSize: "20px" }}>
              <strong>EMAIL:</strong> {data?.email || "abcv@gmail.com"}
            </p>
            <p style={{ fontSize: "20px" }}>
              <strong>FATHER'S NAME:</strong> {data?.fname || "david"}
            </p>
            <p style={{ fontSize: "20px" }}>
              <strong>QUALIFICATION/INSTITUTION DETAILS:</strong> {data?.qualification}
            </p>
            <p style={{ fontSize: "20px" }}>
              <strong>DOB:</strong> {moment(data?.dob).format("DD-MM-YYYY")}
            </p>
            <p style={{ fontSize: "20px" }}>
              <strong>CONTACT NO. :</strong> {data?.address}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "20px" }}>
          <p>
            <strong>
              Reg ID No. : UDFBharat/
              {data?.uniqueKey < 10 ? `0${data?.uniqueKey}` : data?.uniqueKey}
            </strong>{" "}
            {data?.regId}
          </p>
        </div>
        <div style={{ marginTop: "20px" }}>
          <p>
            <strong style={{fontSize:"10px"}}>
              This is an auto generated card & details are subject to be
              verified by the concerned authorities.
            </strong>
          </p>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "blue",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Download ID Card
      </button>
    </div>
  );
};

export default IDCardGenerator;
