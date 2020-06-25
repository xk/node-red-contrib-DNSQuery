Gets the DNS records of a given type of a domain name. By default gets the A records.
If in msg.payload there's a .domain_name:string, it overrides the domain_name setup in the config box Domain Name.
If in msg.payload there's a .record_type:string, it overrides the record_type setup in the config box Record Type.
Returns the data in msg.payload= {
ok:boolean, domain:domain, type:record_type, answer:[records], error:errortxt, dns_ip:ip }.
Uses by default the DNSs of the OS, but you can specify a different one in the config box DNS.
dnsquery(v1.0.2)
