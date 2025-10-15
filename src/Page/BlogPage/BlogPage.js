import React from "react";
import img from "../../img/EXE/16.png";
import img2 from "../../img/EXE/19.png";
import img3 from "../../img/EXE/18.png";
import { RiArrowDropLeftFill } from "react-icons/ri";

export default function BlogPage() {
  return (
    <div style={{ padding: "2% 5%", backgroundColor: "#F6F6F6" }}>
      {/* Breadcrumb */}
      <div
        style={{
          marginBottom: "20px",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          padding: "10px",
          fontSize: "13px",
        }}
      >
        <span>xmark</span> <RiArrowDropLeftFill style={{ fontSize: "32px" }} />{" "}
        <span>Blog</span> <RiArrowDropLeftFill style={{ fontSize: "32px" }} />{" "}
        <span>Màu đen hợp với màu gì? 9 màu phối với màu đen phù hợp nhất</span>
      </div>
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "bold",
        }}
      >
        Màu đen hợp với màu gì? 9 màu phối với màu đen phù hợp nhất
      </h1>
      <p
        style={{
          fontSize: "16px",
          color: "black",
          fontWeight: "500",
        }}
      >
        Màu đen mạnh mẽ, lịch lãm luôn là lựa chọn hàng đầu của phái mạnh. Tham
        khảo các ý tưởng phối đồ để trả lời câu hỏi “Màu đen hợp với màu gì”
        trong bài viết sau!
      </p>

      <img
        src={img}
        alt="Blog"
        style={{
          width: "100%",
          height: "auto",
        }}
      />
      <p
        style={{
          fontSize: "16px",
          color: "black",
          fontWeight: "500",
          marginTop: "20px",
        }}
      >
        Từ những bộ suit lịch lãm cho đến trang phục thường ngày, màu đen luôn
        là lựa chọn đầy phong cách cho phái mạnh. Tuy nhiên, không phải ai cũng
        thực sự biết rõ màu đen hợp với màu gì để phối đồ cho tinh tế. Cùng tìm
        hiểu câu trả lời thông qua 9 cách phối màu cực hay ho sau đây nhé!
      </p>
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          textAlign: "center",
          marginTop: "5%",
        }}
      >
        Màu đen phối màu trắng - Sự kết hợp kinh điển và thanh lịch
      </h1>
      <p
        style={{
          fontSize: "16px",
          color: "black",
          fontWeight: "500",
          marginTop: "20px",
        }}
      >
        Gợi ý đầu tiên cho câu hỏi “Màu đen phối với màu gì?” chính là màu
        trắng. Đây cũng là  cách phối đồ màu đen theo phong cách tối giản được
        nhiều chàng trai yêu thích. Trang phục đen trắng không chỉ phù hợp với
        nhiều dịp, mà còn giúp người mặc thể hiện được phong cách lịch lãm, tinh
        tế.
      </p>
      <p
        style={{
          fontSize: "16px",
          color: "black",
          fontWeight: "500",
          marginTop: "20px",
        }}
      >
        Bạn có thể thử nghiệm nhiều cách phối đồ khác nhau với bộ đôi đen trắng
        này. Chẳng hạn như áo sơ mi trắng quần tây đen, áo thun đen quần jeans
        trắng hoặc áo khoác đen phối cùng áo len trắng.
      </p>
      <img
        src={img2}
        alt="Blog"
        style={{
          width: "100%",
          height: "auto",
        }}
      />
      <p style={{
        fontSize: "16px",
        color: "black",
        fontWeight: "500",
        textAlign: "center",
        marginTop: "0px",
      }}>
      Phối đồ theo phong cách tối giản với màu đen - trắng
      </p>
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          textAlign: "center",
          marginTop: "5%",
        }}
      >
        Màu đen kết hợp màu xám - Nhẹ nhàng, tinh tế
      </h1>
      <p
        style={{
          fontSize: "16px",
          color: "black",
          fontWeight: "500",
          marginTop: "20px",
        }}
      >
        Nếu bạn muốn tìm kiếm một phong cách nhẹ nhàng, tinh tế nhưng vẫn nam tính thì set đồ đen - xám là lựa chọn tuyệt vời. Màu xám là một màu trung tính, mang đến cảm giác điềm đạm, ổn định và thanh lịch. Khi kết hợp với màu đen, nó tạo nên một sự hài hòa, tinh tế nhưng vẫn đủ để thu hút ánh nhìn
      </p>
      <p
        style={{
          fontSize: "16px",
          color: "black",
          fontWeight: "500",
          marginTop: "20px",
        }}
      >
        Trang phục đen - xám thường được ưa chuộng trong những dịp không yêu cầu sự trang trọng quá mức. Bạn có thể thoải mái diện chúng khi đi làm, gặp gỡ bạn bè hoặc dạo phố.
      </p>
      <img
        src={img3}
        alt="Blog"
        style={{
          width: "100%",
          height: "auto",
        }}
      />
      <p style={{
        fontSize: "16px",
        color: "black",
        fontWeight: "500",
        textAlign: "center",
        marginTop: "0px",
        marginBottom: "10%",
      }}>
      Phối đồ tinh tế, nhẹ nhàng bằng cách kết hợp màu xám với màu đen
      </p>
    </div>
  );
}
