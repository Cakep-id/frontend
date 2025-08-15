import { Accordion, Col, Container, Row } from "react-bootstrap";
import caraImg from "../assets/cara.png";

const caraList = [
	{
		title: "Ambil gambar aset",
		detail: "Foto aset migas yang ingin Anda monitoring menggunakan perangkat mobile atau kamera yang tersedia.",
	},
	{
		title: "Unggah ke Web dan Isi Deskripsi Singkat",
		detail: "Upload gambar aset ke platform CAKEP.id dan tambahkan deskripsi singkat mengenai kondisi atau lokasi aset.",
	},
	{
		title: "Sistem AI Menganalisis",
		detail: "Sistem AI CAKEP.id akan memproses gambar dan deskripsi untuk mendeteksi potensi kerusakan atau risiko.",
	},
	{
		title: "Hasil Klasifikasi Tampil di Dashboard",
		detail: "Setelah analisis selesai, hasil klasifikasi dan rekomendasi akan langsung tampil di dashboard interaktif.",
	},
	{
		title: "Tim Operasional Ambil tindakan",
		detail: "Tim operasional dapat segera mengambil tindakan berdasarkan hasil analisis dan rekomendasi dari sistem.",
	},
];

const Cara = () => {
	return (
		<section id="carakerja" className="py-5 bg-white">
			<Container>
				<h2 className="fw-bold text-center mb-5" data-aos="fade-up">Cara Penggunaan CAKEP.id</h2>
				<Row className="align-items-center">
					<Col md={6} className="mb-4 mb-md-0 text-center" data-aos="fade-right">
						<span className="image-tile">
							<img
								src={caraImg}
								alt="Ilustrasi Cara Penggunaan"
								className="img-fluid"
								style={{ maxHeight: "320px" }}
							/>
						</span>
					</Col>
					<Col md={6} data-aos="fade-left" data-aos-delay="200">
						<Accordion defaultActiveKey="0" flush>
							{caraList.map((item, idx) => (
								<Accordion.Item eventKey={idx.toString()} key={idx}>
									<Accordion.Header>{item.title}</Accordion.Header>
									<Accordion.Body>{item.detail}</Accordion.Body>
								</Accordion.Item>
							))}
						</Accordion>
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default Cara;