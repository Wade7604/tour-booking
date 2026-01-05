const DestinationModel = require("../models/destination.model");
const { DESTINATION_STATUS } = require("../utils/constants");

const destinations = [
  {
    name: "Đà Nẵng",
    slug: "da-nang",
    description:
      "Thành phố biển năng động với bãi biển đẹp, cầu Rồng nổi tiếng và ẩm thực phong phú",
    country: "Vietnam",
    city: "Đà Nẵng",
    images: [
      "https://hoangphuan.com/wp-content/uploads/2024/07/tat-tan-tat-kinh-nghiem-du-lich-tour-da-nang-ma-ban-phai-biet.jpg",
      "https://cdn3.ivivu.com/2022/07/Gi%E1%BB%9Bi-thi%E1%BB%87u-du-l%E1%BB%8Bch-%C4%90%C3%A0-N%E1%BA%B5ng-ivivu-1-e1743500641858.jpg",
    ],
    status: DESTINATION_STATUS.ACTIVE,
  },
  {
    name: "Hội An",
    slug: "hoi-an",
    description:
      "Phố cổ di sản thế giới với kiến trúc cổ kính, đèn lồng rực rỡ và văn hóa độc đáo",
    country: "Vietnam",
    city: "Quảng Nam",
    images: [
      "https://vnexpress.net/cam-nang-du-lich-hoi-an-4446174.html",
      "https://hoiancreativecity.com/uploads/images/thang%202-2023/hoi-an-gd659f3b8f_1920-1280x853.jpg",
    ],
    status: DESTINATION_STATUS.ACTIVE,
  },
  {
    name: "Hạ Long",
    slug: "ha-long",
    description:
      "Di sản thiên nhiên thế giới với hàng nghìn đảo đá vôi kỳ vĩ trên biển",
    country: "Vietnam",
    city: "Quảng Ninh",
    images: [
      "https://cdn.nhandan.vn/images/1ef398c4e2fb4bf07980a2ded785b3ef6da51f0c0ad991901283c66f347bc9e4685e90a6d43591956557c1247283a022cf57c2a816edb3be3cd0e904b555bd11/halongbay-3501.jpg",
      "https://cms.junglebosstours.com/assets/67dd442f-1793-40a1-a3bb-391c3998dffa?format=webp",
    ],
    status: DESTINATION_STATUS.ACTIVE,
  },
  {
    name: "Sapa",
    slug: "sapa",
    description:
      "Thị trấn miền núi với ruộng bậc thang tuyệt đẹp, khí hậu mát mẻ và văn hóa dân tộc đa dạng",
    country: "Vietnam",
    city: "Lào Cai",
    images: [
      "https://res.klook.com/image/upload/fl_lossy.progressive,q_60/Mobile/City/nab4excv9bkndhqnsyvl.jpg",
      "https://www.vietnamairlines.com/~/media/SEO-images/2025%20SEO/Traffic%20TA/MB/sapa-vietnam/sapa-vietnam-thumb_1.jpg",
    ],
    status: DESTINATION_STATUS.ACTIVE,
  },
  {
    name: "Phú Quốc",
    slug: "phu-quoc",
    description:
      "Đảo ngọc với bãi biển trong xanh, rừng nguyên sinh và nghỉ dưỡng cao cấp",
    country: "Vietnam",
    city: "Kiên Giang",
    images: [
      "https://tse2.mm.bing.net/th/id/OIP.MjQAAJKlLLdOlutUnQ2-3gHaDX?rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://rootytrip.com/wp-content/uploads/2024/07/phu-quoc.jpg",
    ],
    status: DESTINATION_STATUS.ACTIVE,
  },
  {
    name: "Nha Trang",
    slug: "nha-trang",
    description:
      "Thành phố biển sôi động với hoạt động lặn biển, đảo đẹp và cuộc sống về đêm sôi nổi",
    country: "Vietnam",
    city: "Khánh Hòa",
    images: [
      "https://puolotrip.com/images/news/bien-nha-trang-3-3532.jpg",
      "https://letsflytravel.vn/wp-content/uploads/2024/08/nha-trang-2.webp",
    ],
    status: DESTINATION_STATUS.ACTIVE,
  },
  {
    name: "Huế",
    slug: "hue",
    description:
      "Cố đô với di tích lịch sử phong phú, kiến trúc hoàng gia và ẩm thực cung đình",
    country: "Vietnam",
    city: "Thừa Thiên Huế",
    images: [
      "https://media-cdn.tripadvisor.com/media/photo-s/03/9b/2f/99/hue.jpg",
      "https://www.vietnam-roads.fr/wp-content/uploads/2017/07/palais-hue.jpg",
    ],
    status: DESTINATION_STATUS.ACTIVE,
  },
  {
    name: "Đà Lạt",
    slug: "da-lat",
    description:
      "Thành phố ngàn hoa với khí hậu ôn đới, thác nước đẹp và kiến trúc Pháp cổ",
    country: "Vietnam",
    city: "Lâm Đồng",
    images: [
      "https://media.vneconomy.vn/w800/images/upload/2023/07/06/1688465738-grasp-the-rainy-season-travel-tips-to-da-lat.jpg",
      "https://media.techcity.cloud/vietnam.vn/2023/07/da-lat-1-16893209234641820444829-2.jpg",
    ],
    status: DESTINATION_STATUS.ACTIVE,
  },
  {
    name: "Mũi Né",
    slug: "mui-ne",
    description:
      "Bãi biển với đồi cát đỏ trắng độc đáo, thích hợp cho lướt ván và nghỉ dưỡng",
    country: "Vietnam",
    city: "Bình Thuận",
    images: [
      "https://innotour.vn/image/cache/catalog/tour-trong-nuoc/phan-thiet-3n2d/thumb/thumb-phan-thiet-3n2d-03-cr-1000x750.jpg",
      "https://thumbs.dreamstime.com/b/phan-thiet-travel-landmark-binh-thuan-vietnam-phan-thiet-sand-dunes-113218996.jpg",
    ],
    status: DESTINATION_STATUS.ACTIVE,
  },
  {
    name: "Ninh Bình",
    slug: "ninh-binh",
    description:
      "Vịnh Hạ Long trên cạn với cảnh quan sông nước, hang động và núi non hùng vĩ",
    country: "Vietnam",
    city: "Ninh Bình",
    images: [
      "https://ninhbinhmotorbike.com/wp-content/uploads/2019/07/99FA378B-AF77-4B52-9DE6-2630287206CA.jpeg",
      "https://tse4.mm.bing.net/th/id/OIP.bSaY6u-PLn4GQOMxMQH8pgHaFj?rs=1&pid=ImgDetMain&o=7&rm=3",
    ],
    status: DESTINATION_STATUS.ACTIVE,
  },
];

const seedDestinations = async () => {
  try {
    console.log("🌱 Seeding destinations...");

    for (const destData of destinations) {
      const exists = await DestinationModel.slugExists(destData.slug);

      if (!exists) {
        await DestinationModel.create(destData);
        console.log(`✅ Created destination: ${destData.name}`);
      } else {
        console.log(`⏭️  Destination already exists: ${destData.name}`);
      }
    }

    console.log("✅ Destinations seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding destinations:", error);
    throw error;
  }
};

module.exports = seedDestinations;
