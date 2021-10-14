Gets the DNS records of a given type of a domain name.

By default this node gets the A records, but other [record types](https://en.wikipedia.org/wiki/List_of_DNS_record_types) can be queried. The ***"ANY"*** record type should return ALL available records (but unfortunately doesn't always work).

+ If in ```msg.payload``` there's a .domain_name:string, it overrides the domain_name setup in the config box Domain Name.
+ If in ```msg.payload``` there's a .record_type:string, it overrides the record_type setup in the config box Record Type.
+ If in ```msg.payload``` there's a .dns_ip:string, it overrides the dns_ip setup in the config box DNS IP.

Returns the data in ```msg.payload``` with following content:
```
{
   ok:boolean,
   error:errortxt,
   dns_ip: dns_ip,
   domain:domain,
   type:record_type,
   answer:[
      records
   ]
}
```
Uses by default the DNSs of the OS, but you can specify a different one in the config box DNS.
dnsquery(v1.0.7)

Example:

![example](https://raw.githubusercontent.com/xk/node-red-contrib-DNSQuery/master/img/1_0_5.gif)
![example](https://raw.githubusercontent.com/xk/node-red-contrib-DNSQuery/master/img/TXTQuery.png)
![example](https://raw.githubusercontent.com/xk/node-red-contrib-DNSQuery/master/img/AAAA_query.png)
