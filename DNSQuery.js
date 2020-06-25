//2020-07-23 dnsquery jorge@jorgechamorro.com

module.exports= function(RED) {

    "use strict";
    var dns= require("dns");
    var initial_dns_ip= dns.getServers()[0];

    function dnsquery (config) {

        RED.nodes.createNode(this, config);
        var node= this;
        var now_using_dns_ip= dns.getServers()[0];

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

            if (msg.payload.domain_name) {
              if (typeof msg.payload.domain_name === "string") {
                domain= msg.payload.domain_name;
              }
              else err= "msg.payload.domain_name is not a string";
            }
            else if (config.domain_name) {
              if (typeof config.domain_name === "string") {
                domain= config.domain_name;
              }
              else err= "config.domain_name is not a string";
            }
            else err= "invalid domain name";

						//Qué record_type hemos de mirar?
            //Si msg.payload contiene record_type se usa msg.payload.record_type
            //Si no, se intenta usar config.record_type
            //Si no, se usa "A"

						if (msg.payload && msg.payload.record_type) {
							record_type= msg.payload.record_type;
						}
						else if (config.record_type) {
							record_type= config.record_type;
						}
						else record_type= "A";

            if (err) {
              setTimeout(function () { cb(err, []); }, 0);
              return;
            }

            if (config.dns_ip) {
              if (typeof config.dns_ip === "string") {
                var dns_ip= validar_ip(config.dns_ip);
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
