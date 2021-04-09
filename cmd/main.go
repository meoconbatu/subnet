package main

import (
	"fmt"
	"github/meoconbatu/subnet"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	err := filepath.Walk(".", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		fmt.Println(path, info.Size())
		return nil
	})
	if err != nil {
		log.Println(err)
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.Handle("/", http.FileServer(http.Dir("web/view/build/")))

	http.HandleFunc("/subnet", subnet.SubnetHandler)
	http.HandleFunc("/divide", subnet.DivideHandler)
	http.HandleFunc("/search", subnet.SearchHandler)
	http.HandleFunc("/download", subnet.DownloadHandler)
	http.HandleFunc("/upload", subnet.UploadHandler)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
