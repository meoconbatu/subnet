package subnet

import (
	"encoding/binary"
	"fmt"
	"net"
)

type Subnet struct {
	CIDR            string   `json:"cidr"`
	Mask            string   `json:"mask,omitempty"`
	AvailableIPMin  string   `json:"availableIPMin,omitempty"`
	AvailableIPMax  string   `json:"availableIPMax,omitempty"`
	Hosts           int      `json:"hosts,omitempty"`
	Prefix          int      `json:"prefix,omitempty"`
	Children        []Subnet `json:"children,omitempty"`
	NumVisibleChild int      `json:"numVisibleChild,omitempty"`
	Note            string   `json:"note"`
}

// GetSubnet returns the Subnet of CIDR notation ipAddr/prefix
func GetSubnet(ipAddr string, prefix int) (*Subnet, error) {
	_, ipnet, err := net.ParseCIDR(fmt.Sprintf("%s/%d", ipAddr, prefix))
	if err != nil {
		return nil, err
	}
	subnet := getSubnetFromIPNet(ipnet)
	return &subnet, nil
}

// GetSubnetFromCIDR parses cidr as a CIDR notation IP address and prefix length,
// like "192.168.0.0/24" and returns the Subnet
func GetSubnetFromCIDR(cidr string) (*Subnet, error) {
	_, ipnet, err := net.ParseCIDR(cidr)
	if err != nil {
		return nil, err
	}
	subnet := getSubnetFromIPNet(ipnet)
	return &subnet, nil
}

// GetAllSubnets returns all subnets of the network
func GetAllSubnets(network Subnet) []Subnet {
	if network.Children == nil {
		return []Subnet{{CIDR: network.CIDR, Note: network.Note, Children: network.Children}}
	}
	subnets := []Subnet{}
	for _, child := range network.Children {
		subnets = append(subnets, GetAllSubnets(child)...)
	}
	return subnets
}
func BuildNetworkFromSubnets(cidr string, subnets []Subnet) (*Subnet, int) {
	maxPrefix := 0
	return buildNetworkFromSubnets(cidr, subnets, &maxPrefix), maxPrefix
}
func buildNetworkFromSubnets(cidr string, subnets []Subnet, maxPrefix *int) *Subnet {
	if len(subnets) == 0 {
		return nil
	}
	root, _ := GetSubnetFromCIDR(cidr)
	for i, subnet := range subnets {
		if subnet.CIDR == root.CIDR {
			copy(subnets[i:], subnets[i+1:])
			subnets = subnets[:len(subnets)-1]
			root.Note = subnet.Note
			if root.Prefix > *maxPrefix {
				*maxPrefix = root.Prefix
			}
			return root
		}
	}
	root.NumVisibleChild = 0
	children, _ := DivideNetworkFromCIDR(root.CIDR)
	for _, child := range children {
		root.Children = append(root.Children, *buildNetworkFromSubnets(child.CIDR, subnets, maxPrefix))
		root.NumVisibleChild += root.Children[len(root.Children)-1].NumVisibleChild
	}
	return root
}
func getSubnetFromIPNet(ipnet *net.IPNet) Subnet {
	ipmin, ipmax := getAvailableIPRange(ipnet)
	prefix, _ := ipnet.Mask.Size()
	return Subnet{ipnet.String(), getNetMask(ipnet.Mask), ipmin.String(), ipmax.String(), CountHosts(ipnet), prefix, nil, 1, ""}
}
func getAvailableIPRange(ipnet *net.IPNet) (net.IP, net.IP) {
	ones, bits := ipnet.Mask.Size()
	zeros := bits - (ones + 1)

	ipmin := net.IPv4(ipnet.IP[0], ipnet.IP[1], ipnet.IP[2], ipnet.IP[3]).To4()
	ipmax := net.IPv4(ipnet.IP[0], ipnet.IP[1], ipnet.IP[2], ipnet.IP[3]).To4()
	for k := 0; k <= zeros; k++ {
		i, j := 3-k/8, k%8
		ipmax[i] |= (1 << j)
	}
	if zeros >= 2 {
		ipmin[3] += 1
		ipmax[3] -= 1
	}
	return ipmin, ipmax
}
func getNetMask(mask net.IPMask) string {
	return fmt.Sprintf("%d.%d.%d.%d", mask[0], mask[1], mask[2], mask[3])
}

// CountHosts return the number of available hosts on a network.
func CountHosts(ipnet *net.IPNet) int {
	mask := binary.BigEndian.Uint32(ipnet.Mask)
	hosts := int(mask^0xffffffff) + 1
	if hosts > 2 {
		return hosts - 2
	}
	return hosts
}

// DivideNetworkFromCIDR parses cidr as a network and divides it into 2 subnets
func DivideNetworkFromCIDR(cidr string) ([]Subnet, error) {
	_, ipnet, err := net.ParseCIDR(cidr)
	if err != nil {
		return nil, err
	}
	ones, _ := ipnet.Mask.Size()
	ipnets, err := DivideNetwork(ipnet, ones+1)
	if err != nil {
		return nil, err
	}
	subnets := make([]Subnet, len(ipnets))
	for i, ipnet := range ipnets {
		subnets[i] = getSubnetFromIPNet(ipnet)
	}
	return subnets, nil
}

// DivideSubnet divides a network ipnet into smaller subnets according to prefix length
func DivideNetwork(ipnet *net.IPNet, prefix int) ([]*net.IPNet, error) {
	ones, bits := ipnet.Mask.Size()
	if ones > prefix {
		return nil, fmt.Errorf("Prefix (%d) must be larger than the number of leading ones (%d)", prefix, ones)
	}
	if ones == prefix {
		return []*net.IPNet{ipnet}, nil
	}
	subnet0s, err := DivideNetwork(&net.IPNet{IP: ipnet.IP, Mask: net.CIDRMask(ones+1, bits)}, prefix)
	if err != nil {
		return nil, err
	}

	zeros := bits - (ones + 1)
	i, j := 3-zeros/8, zeros%8

	newip := net.IPv4(ipnet.IP[0], ipnet.IP[1], ipnet.IP[2], ipnet.IP[3]).To4()
	newip[i] = newip[i] | (1 << j)

	subnet1s, err := DivideNetwork(&net.IPNet{IP: newip, Mask: net.CIDRMask(ones+1, bits)}, prefix)
	if err != nil {
		return nil, err
	}
	return append(subnet0s, subnet1s...), nil
}

// SearchSubnetFromCIDR returns the smallest Subnet belongs to the network
func SearchSubnetFromCIDR(network Subnet, cidr string) (*Subnet, error) {
	_, ipnet, err := net.ParseCIDR(cidr)
	if err != nil {
		return nil, err
	}
	return SearchSubnet(network, *ipnet)
}
func SearchSubnet(network Subnet, ipnetSearch net.IPNet) (*Subnet, error) {
	if network.CIDR == ipnetSearch.String() {
		return &network, nil
	}
	if network.Children == nil {
		_, ipnet, err := net.ParseCIDR(network.CIDR)
		if err != nil {
			return nil, err
		}
		if ipnet.Contains(ipnetSearch.IP) {
			return &network, nil
		}
	}
	for _, child := range network.Children {
		result, err := SearchSubnet(child, ipnetSearch)
		if err != nil {
			return nil, err
		}
		if result != nil {
			return result, nil
		}
	}
	return nil, nil
}
