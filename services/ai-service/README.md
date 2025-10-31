# AI Service

## Mô tả
Service AI gợi ý giá bán tín chỉ carbon

## Chức năng
- AI gợi ý giá bán tín chỉ dựa trên dữ liệu thị trường
- Predict giá tối ưu (fixed price / auction)
- Machine Learning model (TensorFlow/scikit-learn)
- Training model từ dữ liệu giao dịch platform

## Tech Stack
- Python + FastAPI
- TensorFlow / scikit-learn
- Pandas + NumPy

## APIs
- POST /predict/price - Gợi ý giá bán
- POST /predict/demand - Dự đoán nhu cầu
- GET /model/stats - Thống kê model

## Port
3009
