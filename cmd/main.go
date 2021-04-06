package main

import (
	"github/meoconbatu/subnet"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/subnet", subnet.SubnetHandler)
	http.HandleFunc("/divide", subnet.DivideHandler)
	http.HandleFunc("/search", subnet.SearchHandler)
	http.HandleFunc("/download", subnet.DownloadHandler)
	http.HandleFunc("/upload", subnet.UploadHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
