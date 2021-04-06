package subnet

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

type Network struct {
	Subnets Subnet `json:"subnets"`
}

type Search struct {
	Net  map[string]Network `json:"network"`
	CIDR string             `json:"cidr"`
}
type Upload struct {
	Subnets   Subnet `json:"subnets"`
	MaxPrefix int    `json:"maxPrefix"`
}

func SubnetHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if err := r.ParseForm(); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	addr := r.FormValue("address")
	prefix, err := strconv.Atoi(r.FormValue("prefix"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	subnets, err := GetSubnet(addr, prefix)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	json.NewEncoder(w).Encode(subnets)
}
func DivideHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if err := r.ParseForm(); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	cidr := r.FormValue("cidr")
	subnets, err := DivideNetworkFromCIDR(cidr)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	json.NewEncoder(w).Encode(subnets)
}

func SearchHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	var searchInfo Search
	err := json.NewDecoder(r.Body).Decode(&searchInfo)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	result := make(map[string]Subnet)
	for network, subnets := range searchInfo.Net {
		temp, err := SearchSubnetFromCIDR(subnets.Subnets, searchInfo.CIDR)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		if temp != nil {
			result[network] = *temp
		}
	}
	json.NewEncoder(w).Encode(result)
}

func DownloadHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	var networks map[string]Network
	err := json.NewDecoder(r.Body).Decode(&networks)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	data := make(map[string][]Subnet)
	for network, subnets := range networks {
		data[network] = GetAllSubnets(subnets.Subnets)
	}
	json.NewEncoder(w).Encode(data)
}

func UploadHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	var networks map[string][]Subnet
	err := json.NewDecoder(r.Body).Decode(&networks)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	data := make(map[string]Upload)
	for network, subnets := range networks {
		sn, maxPrefix := BuildNetworkFromSubnets(network, subnets)
		data[network] = Upload{*sn, maxPrefix}
	}
	json.NewEncoder(w).Encode(data)
}
