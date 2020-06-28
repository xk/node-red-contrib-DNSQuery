//2020-07-25 dnsquery jorge@jorgechamorro.com

module.exports= function(RED) {

    "use strict";
    var dns= require("dns");
    var initial_dns_ip= dns.getServers()[0];

    function dnsquery (config) {

        RED.nodes.createNode(this, config);
        var node= this;
        var now_using_dns_ip= dns.getServers()[0];

        node.domain_name = config.domain_name || ""
        node.domain_nameType = config.domain_nameType || "str";
        node.record_type = config.record_type || "A";
        node.record_typeType = config.record_typeType || "rectype";
        node.dns_ip = config.dns_ip;

        function validar_ip (ip) {
          var r= ip.split(".");
          if (r.length !== 4) return "";
          r= r.filter(function(v,i,o) {
            var n= Math.floor(+v);
            if (v !== (""+n)) return false;
            if ((n<0) || (n>255)) return false;
            return true;
          });
          return (r.length === 4) ? r.join(".") : "";
        }

        function isArray (p) {
          //Miller device
          return (({}).toString.apply(p).toLowerCase().indexOf("array") > 0);
        }

        node.on('input', function (msg) {

            function cb (err, o) {

              msg.payload= {
                ok:(!err),
                domain:domain,
                type:record_type,
                answer:o,
                error:err,
                dns_ip: now_using_dns_ip
              };

              node.send(msg);

            };


            var err;
            var domain;
            var record_type;

            //Qué domain name hemos de mirar?
            //Si msg.payload contiene domain_name se usa msg.payload.domain_name
            //Si no, se intenta usar config.domain_name
            
            RED.util.evaluateNodeProperty(node.domain_name,node.domain_nameType,node,msg,(error,value) => {
              if (error) {
                  err = error;
              } else {
                domain = value
              }
            }); 
            RED.util.evaluateNodeProperty(node.record_type,node.record_typeType,node,msg,(error,value) => {
              if (error) {
                  err = error;
              } else {
                record_type = value || "A"
              }
            }); 

            if (err) {
              setTimeout(function () { cb(err, []); }, 0);
              return;
            }

            if (node.dns_ip) {
              if (typeof node.dns_ip === "string") {
                var dns_ip= validar_ip(node.dns_ip);
                if (dns_ip) {
                  if (dns_ip !== now_using_dns_ip) {
                    dns.setServers([ dns_ip ]);
                    now_using_dns_ip= dns_ip;
                  }
                }
              }
            }
            else if (now_using_dns_ip !== initial_dns_ip) {
              dns.setServers([ initial_dns_ip ]);
              now_using_dns_ip= initial_dns_ip;
            }

            dns.resolve(domain, record_type, cb);
        });
    }
    RED.nodes.registerType("dnsquery", dnsquery);
};
