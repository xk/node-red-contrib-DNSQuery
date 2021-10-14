//2020-07-25 dnsquery jorge@jorgechamorro.com
//2021-10-14 v1.0.7

module.exports= function(RED) {

    "use strict";
    var dns= require("dns");

    function dnsquery (config) {

        RED.nodes.createNode(this, config);
        var node= this;

        node.domain_name = config.domain_name || "";
        node.record_type = config.record_type || "A";
        node.dns_ip = config.dns_ip || dns.getServers()[0];
        
        node.on('input', function (msg) {

            var payload = msg.payload;
            var dns_ip = node.dns_ip;
            var domain = node.domain_name;
            var record_type = node.record_type;

            //msg.payload overrides?
            //Si msg.payload contiene domain_name se usa msg.payload.domain_name
            //Si no, se usa config.domain_name
            //Idem para record_type
            //Idem para dns_ip
            
            if (typeof payload === "object") {
                if (payload.dns_ip) dns_ip = payload.dns_ip;
                if (payload.domain_name) domain = payload.domain_name;
                if (payload.record_type) record_type = payload.record_type;
            }
            
            if (dns_ip !== dns.getServers()[0]) dns.setServers([ dns_ip ]);
            
            dns.resolve(domain, record_type, function cb (err, o) {

              msg.payload= {
                ok:(!err),
                error:err,
                dns_ip: dns_ip,
                type:record_type,
                domain:domain,
                answer:o
              };

              node.send(msg);
            });
        });
    }
    RED.nodes.registerType("dnsquery", dnsquery);
};
