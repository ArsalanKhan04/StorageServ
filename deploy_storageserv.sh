sudo docker build -t gcr.io/cld-1-proj/stor-serv .
sudo docker push gcr.io/cld-1-proj/stor-serv
gcloud run deploy stor-serv --image=gcr.io/cld-1-proj/stor-serv --platform=managed --region=us-central1 --allow-unauthenticated

