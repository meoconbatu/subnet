package subnet

import (
	"net"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCountHosts(t *testing.T) {
	tests := []struct {
		ipnet *net.IPNet
		hosts int
	}{
		{&net.IPNet{IP: net.IPv4(172, 16, 0, 0), Mask: net.CIDRMask(12, 32)}, 1048574},
		{&net.IPNet{IP: net.IPv4(172, 24, 0, 0), Mask: net.CIDRMask(13, 32)}, 524286},
		{&net.IPNet{IP: net.IPv4(192, 168, 0, 128), Mask: net.CIDRMask(26, 32)}, 62},
		{&net.IPNet{IP: net.IPv4(192, 168, 0, 232), Mask: net.CIDRMask(31, 32)}, 2},
		{&net.IPNet{IP: net.IPv4(192, 168, 0, 234), Mask: net.CIDRMask(32, 32)}, 1},
	}
	for _, tt := range tests {
		t.Run(tt.ipnet.String(), func(t *testing.T) {
			hosts := CountHosts(tt.ipnet)
			assert.EqualValues(t, tt.hosts, hosts)
		})
	}
}

func TestDivideNetwork(t *testing.T) {
	tests := []struct {
		ipnet   *net.IPNet
		prefix  int
		subnets []*net.IPNet
	}{
		{&net.IPNet{IP: net.IPv4(192, 168, 0, 0).To4(), Mask: net.CIDRMask(24, 32)}, 25,
			[]*net.IPNet{
				{IP: net.IPv4(192, 168, 0, 0).To4(), Mask: net.CIDRMask(25, 32)},
				{IP: net.IPv4(192, 168, 0, 128).To4(), Mask: net.CIDRMask(25, 32)},
			}},
		{&net.IPNet{IP: net.IPv4(192, 168, 0, 128).To4(), Mask: net.CIDRMask(26, 32)}, 27,
			[]*net.IPNet{
				{IP: net.IPv4(192, 168, 0, 128).To4(), Mask: net.CIDRMask(27, 32)},
				{IP: net.IPv4(192, 168, 0, 160).To4(), Mask: net.CIDRMask(27, 32)},
			}},
		{&net.IPNet{IP: net.IPv4(192, 168, 0, 0).To4(), Mask: net.CIDRMask(24, 32)}, 26,
			[]*net.IPNet{
				{IP: net.IPv4(192, 168, 0, 0).To4(), Mask: net.CIDRMask(26, 32)},
				{IP: net.IPv4(192, 168, 0, 64).To4(), Mask: net.CIDRMask(26, 32)},
				{IP: net.IPv4(192, 168, 0, 128).To4(), Mask: net.CIDRMask(26, 32)},
				{IP: net.IPv4(192, 168, 0, 192).To4(), Mask: net.CIDRMask(26, 32)},
			}},
		{&net.IPNet{IP: net.IPv4(192, 168, 0, 0).To4(), Mask: net.CIDRMask(25, 32)}, 27,
			[]*net.IPNet{
				{IP: net.IPv4(192, 168, 0, 0).To4(), Mask: net.CIDRMask(27, 32)},
				{IP: net.IPv4(192, 168, 0, 32).To4(), Mask: net.CIDRMask(27, 32)},
				{IP: net.IPv4(192, 168, 0, 64).To4(), Mask: net.CIDRMask(27, 32)},
				{IP: net.IPv4(192, 168, 0, 96).To4(), Mask: net.CIDRMask(27, 32)},
			}},
	}
	for _, tt := range tests {
		t.Run(tt.ipnet.String(), func(t *testing.T) {
			subnets, _ := DivideNetwork(tt.ipnet, tt.prefix)
			assert.EqualValues(t, tt.subnets, subnets)
		})
	}
}
func TestGetAvailableIPRange(t *testing.T) {
	tests := []struct {
		ipnet        *net.IPNet
		ipmin, ipmax net.IP
	}{
		{&net.IPNet{IP: net.IPv4(172, 16, 0, 0).To4(), Mask: net.CIDRMask(12, 32)}, net.ParseIP("172.16.0.1").To4(), net.ParseIP("172.31.255.254").To4()},
		{&net.IPNet{IP: net.IPv4(172, 24, 0, 0).To4(), Mask: net.CIDRMask(13, 32)}, net.ParseIP("172.24.0.1").To4(), net.ParseIP("172.31.255.254").To4()},
		{&net.IPNet{IP: net.IPv4(192, 168, 0, 128).To4(), Mask: net.CIDRMask(26, 32)}, net.ParseIP("192.168.0.129").To4(), net.ParseIP("192.168.0.190").To4()},
		{&net.IPNet{IP: net.IPv4(192, 168, 0, 232).To4(), Mask: net.CIDRMask(31, 32)}, net.ParseIP("192.168.0.232").To4(), net.ParseIP("192.168.0.233").To4()},
		{&net.IPNet{IP: net.IPv4(192, 168, 0, 234).To4(), Mask: net.CIDRMask(32, 32)}, net.ParseIP("192.168.0.234").To4(), net.ParseIP("192.168.0.234").To4()},
		{&net.IPNet{IP: net.IPv4(192, 168, 0, 0).To4(), Mask: net.CIDRMask(29, 32)}, net.ParseIP("192.168.0.1").To4(), net.ParseIP("192.168.0.6").To4()},
	}
	for _, tt := range tests {
		t.Run(tt.ipnet.String(), func(t *testing.T) {
			ipmin, ipmax := getAvailableIPRange(tt.ipnet)
			assert.EqualValues(t, tt.ipmin, ipmin)
			assert.EqualValues(t, tt.ipmax, ipmax)
		})
	}
}

func TestSearchSubnet(t *testing.T) {
	tests := []struct {
		network     Subnet
		ipnetSearch net.IPNet
		subnet      Subnet
		err         error
	}{
		{Subnet{CIDR: "192.168.0.0/22", Children: nil}, net.IPNet{IP: net.IPv4(192, 168, 1, 192).To4(), Mask: net.CIDRMask(27, 32)},
			Subnet{CIDR: "192.168.0.0/22", Children: nil}, nil,
		},
		{Subnet{CIDR: "192.168.0.0/22", Children: []Subnet{{CIDR: "192.168.0.0/23", Children: nil}, {CIDR: "192.168.2.0/23", Children: nil}}},
			net.IPNet{IP: net.IPv4(192, 168, 1, 192).To4(), Mask: net.CIDRMask(27, 32)},
			Subnet{CIDR: "192.168.0.0/23", Children: nil}, nil,
		},
	}
	for _, tt := range tests {
		t.Run(tt.ipnetSearch.String(), func(t *testing.T) {
			subnet, err := SearchSubnet(tt.network, tt.ipnetSearch)
			assert.EqualValues(t, tt.subnet.CIDR, subnet.CIDR)
			assert.EqualValues(t, tt.err, err)
		})
	}
}
