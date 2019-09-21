export const scripts = [
    {
        title: 'SEO Script (basic)',
        description: `
            <p>This check will validate the following items:</p>
            <ul>
                <li>Title tag not present on page or is empty</li>
                <li>Title tag is less than 10 characters</li>
                <li>Title tag exceeds 65 characters</li>
                <li>Meta description not present on page or is empty</li>
                <li>Meta description exceeds 155 characters</li>
                <li>Page does not specify a viewport</li>
                <li><code class="inline-code">&lt;h1&gt;</code> tag not found on page</li>
                <li>More than one <code class="inline-code">&lt;h1&gt;</code> tag found on page</li>
                <li><code class="inline-code">&lt;h2&gt;</code> tag not found on page</li>
                <li>Page contains less than 500 words</li>
                <li>Invisible and/or JavaScript loaded content</li>
                <li>Image missing <code class="inline-code">alt</code> attribute</li>
                <li>Image size not specified</li>
                <li>URL in <code class="inline-code">hreflang</code> meta tag does not resolve 200 status code</li>
                <li>URL in canonical meta tag does not resolve 200 status code</li>
                <li>Page size exceeds 500KB</li>
            </ul>
        `,
        code: `
            \`\`\`javascript
            // base function
            function opReqGetAsync(paramObject, acct, callback) {
                var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                var opReq = new XMLHttpRequest();
                
                opReq.onreadystatechange = function() {
                    if(opReq.readyState == 4 && opReq.status == 200) {
                        callback(opReq.responseText);
                    }
                }
                
                opReq.open('POST', baseURL, true);
                opReq.send(JSON.stringify(paramObject));
            }

            // seo script code
            var object = new Object,
                images = document.querySelectorAll("img"),
                missing = 0,
                noWidth = 0;
            for (i = 0; i < images.length; i++) "" != images[i].getAttribute("alt") && images[i].getAttribute("alt") || missing++, images[i].getAttribute("width") && images[i].getAttribute("height") || noWidth++;
            noWidth > 0 ? object.Image_Width = noWidth + " of " + images.length + " missing" : object.Image_Width = "Passed", missing > 0 ? object.Image_Alt = missing + " of " + images.length + " missing" : object.Image_Alt = "Passed";
            var failed = 0;
            getStatus = function(e, t, a) {
                try {
                    var n = new XMLHttpRequest;
                    n.onreadystatechange = function() {
                        4 == n.readyState && 200 == n.status ? runAfter(n.status, t) : 4 == n.readyState && 0 == n.status && runAfter(n.responseText, t)
                    }, n.open("GET", e), n.send(), 0 == n.status && 4 == n.readyState && runAfter(n.status, t)
                } catch (o) {
                    failed++
                }
            };
            var badstatus = 0,
                goodstatus = 0,
                total = 0;
            runAfter = function(e, t) {
                "200" != e ? (badstatus++, object.Hreflang_URL = goodstatus + " Passed. " + badstatus + " Bad status. " + failed + " Failed") : "Cononical_URL" == t && "200" == e ? object[t] = "Passed Status-" + e : (goodstatus++, object.Hreflang_URL = goodstatus + " Passed. " + badstatus + " Bad status. " + failed + " Failed"), total = goodstatus + badstatus + failed, total == i && opReqGetAsync(object, "SEO")
            };
            var canonical = document.querySelector("link[rel='canonical']"),
                hreflang = document.querySelectorAll("link[rel='alternate']");
            for (canonical && "" != canonical ? (canonical = canonical.getAttribute("href"), getStatus(canonical, "Cononical_URL")) : object.Cononical_URL = "None Specified", hreflang[0] && "" != hreflang[0] || (object.Hreflang_URL = "No URLs Specified"), i = 0; i < hreflang.length; i++) {
                var hrefLangURL = hreflang[i].getAttribute("href");
                getStatus(hrefLangURL, "Hreflang_URL")
            }
            var DTL = document.title.length;
            document.title | "" == document.title ? object.Page_Title = "Missing or Empty" : 10 > DTL ? object.Page_Title = "<10" : DTL > 65 ? object.Page_Title = ">65" : object.Page_Title = DTL + " Passed";
            var metaD = document.querySelector("meta[name='description']");
            metaD && "" != metaD ? metaD.getAttribute("content").length > 155 ? object.Meta_Description = ">155 chars" : object.Meta_Description = metaD.getAttribute("content").length + " chars Passed" : object.Meta_Description = "Missing or Empty";
            var metaView2 = document.querySelector("meta[name='viewport']");
            if (metaView2) var metaView = metaView2.getAttribute("content");
            var metaFunc = document.querySelectorAll("script:not([type]):not([src])");
            for (j = 0; j < metaFunc.length; j++) {
                var metaFuncJS = metaFunc[j].innerHTML.indexOf("iewport"),
                    metaJSFound = 0; - 1 != metaFuncJS && metaJSFound++
            }
            metaView || 0 != metaJSFound ? object.Meta_Viewport = "Passed" : object.Meta_Viewport = "JS & HTML Missing or Empty";
            var h1 = document.querySelectorAll("h1");
            h1.length > 1 ? object.h1 = h1.length + " h1's" : h1 && 0 != h1.length ? object.h1 = "Passed" : object.h1 = "Missing or Empty";
            var h2 = document.querySelectorAll("h2");
            0 == h2.length ? object.h2 = "h2 missing" : object.h2 = "Passed";
            var words = document.body.innerText.split(/\s/).filter(function(e) {
                return /\S/.test(e)
            }).length;
            500 > words ? object.Word_Quantity = "<500 Words" : words && (object.Word_Quantity = words + " Passed");
            var hidden = document.querySelectorAll("[display='none']");
            hidden.length > 0 ? object.Hidden_Content = hidden.length + " Hidden" : 0 == hidden.length && (object.Hidden_Content = "Passed");
            var pagebytes = document.documentElement.innerHTML.length,
                kbytes = Math.round(pagebytes / 1024);
            kbytes > 500 ? object.Page_Size = "Failed " + kbytes + " kb" : object.Page_Size = "Passed " + kbytes + " kb", hreflang[0] || canonical || opReqGetAsync(object, "SEO");    
            \`\`\`
        `,
        compressed: `var object=new Object,images=document.querySelectorAll("img"),missing=0,noWidth=0;for(i=0;i<images.length;i++)""!=images[i].getAttribute("alt")&&images[i].getAttribute("alt")||missing++,images[i].getAttribute("width")&&images[i].getAttribute("height")||noWidth++;object.Image_Width=0<noWidth?noWidth+" of "+images.length+" missing":"Passed",object.Image_Alt=0<missing?missing+" of "+images.length+" missing":"Passed";var failed=0;getStatus=function(e,t,a){try{var n=new XMLHttpRequest;n.onreadystatechange=function(){4==n.readyState&&200==n.status?runAfter(n.status,t):4==n.readyState&&0==n.status&&runAfter(n.responseText,t)},n.open("GET",e),n.send(),0==n.status&&4==n.readyState&&runAfter(n.status,t)}catch(e){failed++}};var badstatus=0,goodstatus=0,total=0;runAfter=function(e,t){"200"!=e?(badstatus++,object.Hreflang_URL=goodstatus+" Passed. "+badstatus+" Bad status. "+failed+" Failed"):"Cononical_URL"==t&&"200"==e?object[t]="Passed Status-"+e:(goodstatus++,object.Hreflang_URL=goodstatus+" Passed. "+badstatus+" Bad status. "+failed+" Failed"),(total=goodstatus+badstatus+failed)==i&&opReqGetAsync(object,"SEO")};var canonical=document.querySelector("link[rel='canonical']"),hreflang=document.querySelectorAll("link[rel='alternate']");for(canonical&&""!=canonical?(canonical=canonical.getAttribute("href"),getStatus(canonical,"Cononical_URL")):object.Cononical_URL="None Specified",hreflang[0]&&""!=hreflang[0]||(object.Hreflang_URL="No URLs Specified"),i=0;i<hreflang.length;i++){var hrefLangURL=hreflang[i].getAttribute("href");getStatus(hrefLangURL,"Hreflang_URL")}var DTL=document.title.length;document.title|""==document.title?object.Page_Title="Missing or Empty":object.Page_Title=DTL<10?"<10":65<DTL?">65":DTL+" Passed";var metaD=document.querySelector("meta[name="description']");metaD&&""!=metaD?155<metaD.getAttribute("content").length?object.Meta_Description=">155 chars":object.Meta_Description=metaD.getAttribute("content").length+" chars Passed":object.Meta_Description="Missing or Empty";var metaView2=document.querySelector("meta[name="viewport']");if(metaView2)var metaView=metaView2.getAttribute("content");var metaFunc=document.querySelectorAll("script:not([type]):not([src])");for(j=0;j<metaFunc.length;j++){var metaFuncJS=metaFunc[j].innerHTML.indexOf("iewport"),metaJSFound=0;-1!=metaFuncJS&&metaJSFound++}object.Meta_Viewport=metaView||0!=metaJSFound?"Passed":"JS & HTML Missing or Empty";var h1=document.querySelectorAll("h1");1<h1.length?object.h1=h1.length+" h1's":h1&&0!=h1.length?object.h1="Passed":object.h1="Missing or Empty";var h2=document.querySelectorAll("h2");0==h2.length?object.h2="h2 missing":object.h2="Passed";var words=document.body.innerText.split(/\s/).filter(function(e){return/\S/.test(e)}).length;words<500?object.Word_Quantity="<500 Words":words&&(object.Word_Quantity=words+" Passed");var hidden=document.querySelectorAll("[display='none']");0<hidden.length?object.Hidden_Content=hidden.length+" Hidden":0==hidden.length&&(object.Hidden_Content="Passed");var pagebytes=document.documentElement.innerHTML.length,kbytes=Math.round(pagebytes/1024);object.Page_Size=500<kbytes?"Failed "+kbytes+" kb":"Passed "+kbytes+" kb",hreflang[0]||canonical||opReqGetAsync(object,"SEO");`
    },
    {
        title: 'SEO Script (w/ details)',
        description: `
            <p>Captures the actual values from all pages for:</p>
            <ul>
                <li>Meta description</li>
                <li>Meta keywords</li>
                <li>Page title</li>
                <li>Image alt text</li>
                <li>Canonical URL</li>
                <li>Robots tag</li>
                <li><code class="inline-code">&lt;h1&gt;</code> - <code class="inline-code">&lt;h6&gt;</code> tags</li>
            </ul>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // seo w/ details code
                var metaDescription = 'No meta description found',
                    metaKeywords = 'No meta keywords found',
                    pageTitle = 'No page title found',
                    pageURL = window.location.href,
                    imageAlt = '0 alt tags found',
                    canonicalURL = 'No canonical URL found',
                    robots = 'No robots.txt found',
                    h1 = '0 h1 tags found',
                    h2 = '0 h2 tags found',
                    h3 = '0 h3 tags found',
                    h4 = '0 h4 tags found',
                    h5 = '0 h5 tags found',
                    h6 = '0 h6 tags found';

                // meta description
                var metaDescLower = document.querySelector('meta[name="description"]'),
                    metaDescCap   = document.querySelector('meta[name="DESCRIPTION"]');

                if(metaDescLower !== null && metaDescLower.getAttribute('content') !== '') {
                    var metaDesc = metaDescLower.getAttribute('content');
                    var chars = metaDesc.length;
                    metaDescription = metaDesc + ' [' + chars + ' characters]';
                } else if(metaDescCap.length !== null && metaDescCap.getAttribute('content') !== '') {
                    var metaDesc = metaDescCap.getAttribute('content');
                    var chars = metaDesc.length;
                    metaDescription = metaDesc + ' [' + chars + ' characters]';
                }

                // meta keywords
                var metaKeyLower = document.querySelector('meta[name="keywords"]'),
                    metaKeyCap   = document.querySelector('meta[name="KEYWORDS"]');

                if(metaKeyLower !== null && metaKeyLower.getAttribute('content') !== '') {
                    metaKeywords = metaKeyLower.getAttribute('content');
                } else if(metaKeyCap !== null && metaKeyCap.getAttribute('content') !== '') {
                    metaKeywords = metaKeyCap.getAttribute('content');
                }

                // page title
                if(document.title) {
                    pageTitle = document.title;
                }

                // all image alt attributes
                var allImages = document.querySelectorAll('img');

                if(allImages.length > 0) {
                    imageAlt = [];
                    
                    for(var x = 0; x < allImages.length; x++) {
                        alt = allImages[x].getAttribute('alt');
                        if(alt) {
                            imageAlt.push(alt);
                        }
                    }
                    
                    imageAlt = (imageAlt.length > 0) ? imageAlt.join(', ') : '0 alt tags found';
                }

                // canonical URL
                if(document.querySelectorAll('[rel="canonical"]').length > 0) {
                    canonicalURL = document.querySelectorAll('[rel="canonical"]')[0].getAttribute('href');
                }

                // robots.txt
                if(document.querySelectorAll('[name*="robots"]').length > 0) {
                    robots = 'true';
                }

                // all H1s
                var allH1s = document.querySelectorAll('h1');

                if(allH1s.length > 0) {
                    h1 = [];
                    
                    for(var x = 0; x < allH1s.length; x++) {
                        h1.push(allH1s[x].textContent);
                    }
                    
                    h1 = h1.join(', ');
                }

                // all H2s
                var allH2s = document.querySelectorAll('h2');

                if(allH2s.length > 0) {
                    h2 = [];

                    for(var x = 0; x < allH2s.length; x++) {
                        h2.push(allH2s[x].textContent);
                    }
                    
                    h2 = h2.join(', ');
                }

                // all H3s
                var allH3s = document.querySelectorAll('h3');

                if(allH3s.length > 0) {
                    h3 = [];
                    
                    for(var x = 0; x < allH3s.length; x++) {
                        h3.push(allH3s[x].textContent);
                    }
                    
                    h3 = h3.join(', ');
                }

                // all H4s
                var allH4s = document.querySelectorAll('h4');
                if(allH4s.length > 0) {
                    h4 = [];
                    
                    for(var x = 0; x < allH4s.length; x++) {
                        h4.push(allH4s[x].textContent);
                    }
                    
                    h4 = h4.join(', ');
                }

                // all H5s
                var allH5s = document.querySelectorAll('h5');

                if(allH5s.length > 0) {
                    h5 = [];
                    
                    for(var x = 0; x < allH5s.length; x++) {
                        h5.push(allH5s[x].textContent);
                    }
                    
                    h5 = h5.join(', ');
                }

                // all H6s
                var allH6s = document.querySelectorAll('h6');

                if(allH6s.length > 0) {
                    h6 = [];
                    
                    for(var x = 0; x < allH6s.length; x++) {
                        h6.push(allH6s[x].textContent);
                    }
                    
                    h6 = h6.join(', ');
                }

                var seoDataObj = {
                    'Meta_Description': metaDescription,
                    'Page_Title': pageTitle,
                    'Page_URL': pageURL,
                    'Image_Alt': imageAlt,
                    'Canonical_URL': canonicalURL,
                    'Robots.txt': robots,
                    'h1': h1,
                    'h2': h2,
                    'h3': h3,
                    'h4': h4,
                    'h5': h5,
                    'h6': h6
                };

                opReqGetAsync(seoDataObj, 'SEO_Data');
            \`\`\`
        `,
        compressed: `var metaDescription="No meta description found",metaKeywords="No meta keywords found",pageTitle="No page title found",pageURL=window.location.href,imageAlt="0 alt tags found",canonicalURL="No canonical URL found",robots="No robots.txt found",h1="0 h1 tags found",h2="0 h2 tags found",h3="0 h3 tags found",h4="0 h4 tags found",h5="0 h5 tags found",h6="0 h6 tags found",metaDescLower=document.querySelector('meta[name="description"]'),metaDescCap=document.querySelector('meta[name="DESCRIPTION"]');if(null!==metaDescLower&&""!==metaDescLower.getAttribute("content"))metaDescription=(metaDesc=metaDescLower.getAttribute("content"))+" ["+(chars=metaDesc.length)+" characters]";else if(null!==metaDescCap.length&&""!==metaDescCap.getAttribute("content")){var metaDesc,chars;metaDescription=(metaDesc=metaDescCap.getAttribute("content"))+" ["+(chars=metaDesc.length)+" characters]"}var metaKeyLower=document.querySelector('meta[name="keywords"]'),metaKeyCap=document.querySelector('meta[name="KEYWORDS"]');null!==metaKeyLower&&""!==metaKeyLower.getAttribute("content")?metaKeywords=metaKeyLower.getAttribute("content"):null!==metaKeyCap&&""!==metaKeyCap.getAttribute("content")&&(metaKeywords=metaKeyCap.getAttribute("content")),document.title&&(pageTitle=document.title);var allImages=document.querySelectorAll("img");if(0<allImages.length){imageAlt=[];for(var x=0;x<allImages.length;x++)alt=allImages[x].getAttribute("alt"),alt&&imageAlt.push(alt);imageAlt=0<imageAlt.length?imageAlt.join(", "):"0 alt tags found"}0<document.querySelectorAll('[rel="canonical"]').length&&(canonicalURL=document.querySelectorAll('[rel="canonical"]')[0].getAttribute("href")),0<document.querySelectorAll('[name*="robots"]').length&&(robots="true");var allH1s=document.querySelectorAll("h1");if(0<allH1s.length){h1=[];for(x=0;x<allH1s.length;x++)h1.push(allH1s[x].textContent);h1=h1.join(", ")}var allH2s=document.querySelectorAll("h2");if(0<allH2s.length){h2=[];for(x=0;x<allH2s.length;x++)h2.push(allH2s[x].textContent);h2=h2.join(", ")}var allH3s=document.querySelectorAll("h3");if(0<allH3s.length){h3=[];for(x=0;x<allH3s.length;x++)h3.push(allH3s[x].textContent);h3=h3.join(", ")}var allH4s=document.querySelectorAll("h4");if(0<allH4s.length){h4=[];for(x=0;x<allH4s.length;x++)h4.push(allH4s[x].textContent);h4=h4.join(", ")}var allH5s=document.querySelectorAll("h5");if(0<allH5s.length){h5=[];for(x=0;x<allH5s.length;x++)h5.push(allH5s[x].textContent);h5=h5.join(", ")}var allH6s=document.querySelectorAll("h6");if(0<allH6s.length){h6=[];for(x=0;x<allH6s.length;x++)h6.push(allH6s[x].textContent);h6=h6.join(", ")}var seoDataObj={Meta_Description:metaDescription,Page_Title:pageTitle,Page_URL:pageURL,Image_Alt:imageAlt,Canonical_URL:canonicalURL,"Robots.txt":robots,h1:h1,h2:h2,h3:h3,h4:h4,h5:h5,h6:h6};opReqGetAsync(seoDataObj,"SEO_Data");`
    },
    {
        title: 'JSON - LD',
        description: `
            <p>
                Grabs a JS object populated with descriptive data about the web page in a format the 
                search engines can understand. This is one of the more advanced SEO practices and its
                format in addition to its presence is important.  There are specific formatting requirements.
            </p>
            <p>
                <strong>Use Case:</strong> This is often not included in a basic SEO reporting tool
                (because they don't execute js), but it is extremely important.
            </p>`,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // json LDs code
                var jsonLDs = document.querySelectorAll('script[type*="json"][type*="ld"]')
                for (i = 0; i < jsonLDs.length; i++) {
                    var data = jsonLDs[i].innerHTML;
                    var object = JSON.parse(data);
                    
                    opReqGetAsync(object, 'json-ld');
                }
            \`\`\`
        `,
        compressed: `var jsonLDs=document.querySelectorAll('script[type*="json"][type*="ld"]');for(i=0;i<jsonLDs.length;i++){var data=jsonLDs[i].innerHTML,object=JSON.parse(data);opReqGetAsync(object,"json-ld")}`
    },
    {
        title: '1st Party Cookies',
        description: `
            <p>
                Grabs all 1st party cookies set from all pages for all vendors. 
                It does not and cannot grab 3rd party cookies.
            </p>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // 1st party cookies code
                var getCookies = function() {
                    for (var e = document.cookie.split(';'), o = {}, r = 0; r < e.length; r++) {
                        var c = e[r].trim().split('=');
                        o[c[0].replace(/ /g, "_").replace(/['"{}]+/g, '').replace(/,/g, '|')] = decodeURIComponent(c[1]).replace(/ /g, '_').replace(/['"{}]+/g, '').replace(/,/g, '|');
                    }
                    
                    return o;
                };

                var myCookies = getCookies();

                opReqGetAsync(myCookies, 'cookies');
            \`\`\`
        `,
        compressed: `var getCookies=function(){for(var e=document.cookie.split(";"),o={},r=0;r<e.length;r++){var c=e[r].trim().split("=");o[c[0].replace(/ /g,"_").replace(/['"{}]+/g,"").replace(/,/g,"|")]=decodeURIComponent(c[1]).replace(/ /g,"_").replace(/['"{}]+/g,"").replace(/,/g,"|")}return o},myCookies=getCookies();opReqGetAsync(myCookies,"cookies");`
    },
    {
        title: 'Find Downloadable Items',
        description: `
            <p>
                This script will collect all links of type
                <code class="inline-code">&lt;a href="some-path-within/filename.fileextension"&gt;Download link&lt;/a&gt;</code>
                and collect their filenames and the file extension in array "results".
            </p>
            <p>
                If you need to add additional extensions you are welcome to edit the regular expression.
            </p>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // find downloadable items code
                var object = new Object(),
                    regEx = /([a-z0-9\_\-\.])+\.+(txt|csv|ppt|pdf|doc|docx|xls|xlsx|xlt|pptx)+\"?$/gi,
                    results = [],
                    page = location.href,
                    name = 'Download links',
                    links = document.querySelectorAll('a[href]');


                for(var i = 0; i < links.length; i++) {
                    var href = links[i].href;
                    
                    if(!!href.match(regEx)) {
                        results.push(href.match(regEx) + '')
                    }
                }

                // setting info in object
                object.name = name;
                object.page = page;

                // checking if there is no result
                results.length == 0 ? object.linksFound = 'no download links found' : object.linksFound = results;

                // sending info to OP
                opReqGetAsync(object, 'Download links');
            \`\`\`
        `,
        compressed: `for(var object=new Object,regEx=/([a-z0-9\_\-\.])+\.+(txt|csv|ppt|pdf|doc|docx|xls|xlsx|xlt|pptx)+\"?$/gi,results=[],page=location.href,name="Download links",links=document.querySelectorAll("a[href]"),i=0;i<links.length;i++){var href=links[i].href;href.match(regEx)&&results.push(href.match(regEx)+"")}object.name=name,object.page=page,0==results.length?object.linksFound="no download links found":object.linksFound=results,opReqGetAsync(object,"Download links");`
    },
    {
        title: 'DTM Header & Footer',
        description: `
            <p>
                Grabs the header and footer JavaScript values including whether or not the value
                contains staging, which is the key purpose of this custom tag. For every DTM tag
                that is implemented there are 2 snippets of code – staging and prod. This will
                check to make sure the staging code is not in producction.
            </p>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // DTM header & footer code
                var object = new Object();
                var dtmHead = document.querySelector('script[src*="satelliteLib"]')

                if(dtmHead) {
                    var dtmHeadSRC = dtmHead.getAttribute('src');
                    object['DTM_Header_Value'] = dtmHeadSRC.substring(dtmHeadSRC.lastIndexOf('/'), dtmHeadSRC.length);
                }

                function contains(selector, text) {
                    var elements = document.querySelectorAll(selector);
                    
                    return [].filter.call(elements, function(element) {
                        return RegExp(text).test(element.textContent);
                    });
                }

                var dtmFoot = contains('script', '_satellite.pageBottom()');

                if (dtmFoot[0] != null) {
                    object.DTM_Footer = 'Present';
                }

                if (dtmHead || dtmFoot[0] != null) {
                    opReqGetAsync(object, 'DTM');
                }
            \`\`\`
        `,
        compressed: `var object=new Object,dtmHead=document.querySelector('script[src*="satelliteLib"]');if(dtmHead){var dtmHeadSRC=dtmHead.getAttribute("src");object.DTM_Header_Value=dtmHeadSRC.substring(dtmHeadSRC.lastIndexOf("/"),dtmHeadSRC.length)}function contains(t,e){var o=document.querySelectorAll(t);return[].filter.call(o,function(t){return RegExp(e).test(t.textContent)})}var dtmFoot=contains("script","_satellite.pageBottom()");null!=dtmFoot[0]&&(object.DTM_Footer="Present"),!dtmHead&&null==dtmFoot[0]||opReqGetAsync(object,"DTM");`
    },
    {
        title: 'Adobe External Links',
        description: `
            <p>
                This code matches all external links based on Adobe Analytics internalFilters definition.
                The code checks if Adobe is connected to the website and, if not, sends an object to ObservePoint
                with two  keys:
            </p>
            <ul>
                <li>page: <i>href of webpage</i></li>
                <li>internalFilters: "Internal filters not found on current page"</li>
            </ul>
            <p>
                If Adobe is connected we collect the <code class="inline-code">s.linkInternalFilters</code>
                to an array and check every link for matches.
            </p>
            `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // adobe external links code
                var object = {},
                    extLinks = [],
                    adobeObject = window['s'] || 's not found',
                    links = Object.keys(document.querySelectorAll('a[href]')).map(function(key) {
                        return document.querySelectorAll('a[href]')[key]
                    });

                if(typeof adobeObject == 'object') {
                    var regEx = new RegExp(s.linkInternalFilters.replace(/,/g, '|'), 'g');
                    
                    for(var i = links.length - 1; i >= 0; i--) {
                        if (links[i].href.search(regEx) == -1) {
                            extLinks.push(links[i].href)
                        }
                    }
                    
                    object.page = location.href;
                    extLinks.length == 0 ? object.externalLinks = 'No external links found' : object.externalLinks = extLinks;
                    
                    opReqGetAsync(object, 'External Links');
                } else {
                    object.internalFilters = 'Internal filters not found on current page';
                    opReqGetAsync(object, 'External Links');
                }
            \`\`\`
        `,
        compressed: `var object={},extLinks=[],adobeObject=window.s||"s not found",links=Object.keys(document.querySelectorAll("a[href]")).map(function(e){return document.querySelectorAll("a[href]")[e]});if("object"==typeof adobeObject){for(var regEx=new RegExp(s.linkInternalFilters.replace(/,/g,"|"),"g"),i=links.length-1;0<=i;i--)-1==links[i].href.search(regEx)&&extLinks.push(links[i].href);object.page=location.href,0==extLinks.length?object.externalLinks="No external links found":object.externalLinks=extLinks,opReqGetAsync(object,"External Links")}else object.internalFilters="Internal filters not found on current page",opReqGetAsync(object,"External Links");`
    },
    {
        title: 'All Links Not Current Domain',
        description: `
            <p>Find all links on the page that don't contain the current domain.</p>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // all links not current domain code
                var object = new Object(),
                    domain = location.host.replace('www.', ''),
                    regEx = new RegExp(domain, 'g'),
                    links = document.querySelectorAll('a[href]'),
                    result = Object.keys(links).map(function(key) {
                        return links[key]
                    }),
                    hrefs = [],
                    otherDomain = [];

                // collecting all hrefs 
                for(var i = result.length - 1; i >= 0; i--) {
                    hrefs.push(result[i].href)
                }

                // checking if href string contains domain and pushing them to array of results
                for (var i = hrefs.length - 1; i >= 0; i--) {
                    if (hrefs[i].search(regEx) == '-1') {
                        otherDomain.push(hrefs[i]);
                    }
                }

                object.webPage = location.href;
                object.totalLinks = hrefs.length;
                object.totalOtherDomainLinks = otherDomain.length;
                otherDomain.length == 0 ? object.otherDomainLinks = 'no other domain links found' : object.otherDomainLinks = otherDomain;

                opReqGetAsync(object, 'Other Domain Links');
            \`\`\`
        `,
        compressed: `for(var object=new Object,domain=location.host.replace("www.",""),regEx=new RegExp(domain,"g"),links=document.querySelectorAll("a[href]"),result=Object.keys(links).map(function(e){return links[e]}),hrefs=[],otherDomain=[],i=result.length-1;0<=i;i--)hrefs.push(result[i].href);for(i=hrefs.length-1;0<=i;i--)"-1"==hrefs[i].search(regEx)&&otherDomain.push(hrefs[i]);object.webPage=location.href,object.totalLinks=hrefs.length,object.totalOtherDomainLinks=otherDomain.length,0==otherDomain.length?object.otherDomainLinks="no other domain links found":object.otherDomainLinks=otherDomain,opReqGetAsync(object,"Other Domain Links");`
    },
    {
        title: 'DTM Rules',
        description: `
            <p>
                This code captures all the DTM rules that fired on a given page. The DTM numbers are
                arbitrary and don't represent the actual rule numbers – just the ways to uniquely
                identify the rules.
            </p>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // dtm rules code
                var object = new Object();
                var DTM_logs = _satellite.Logger.getHistory();

                for(var i = 0; i < DTM_logs.length; i++) {
                    var value = DTM_logs[i][1];
                    
                    if(value.indexOf('fired') != -1) {
                        var rulename = DTM_logs[i][1];
                        var position = rulename.indexOf('fired') - 1;
                        
                        rulename = rulename.substring(0, position);
                        rulename = rulename.replace(/ /g, '_').replace(/'/g, '');
                        object[rulename] = 'Fired';
                    }
                }

                opReqGetAsync(object, 'DTM_Rules');
            \`\`\`
        `,
        compressed: `for(var object=new Object,DTM_logs=_satellite.Logger.getHistory(),i=0;i<DTM_logs.length;i++){var value=DTM_logs[i][1];if(-1!=value.indexOf("fired")){var rulename=DTM_logs[i][1],position=rulename.indexOf("fired")-1;object[rulename=(rulename=rulename.substring(0,position)).replace(/ /g,"_").replace(/'/g,"")]="Fired"}}opReqGetAsync(object,"DTM_Rules");`
    },
    {
        title: 'Tealium JS Loader',
        description: `
            <p>
                Capture what JavaScript library was used (dev/staging/production). Helps to make
                sure all prod JavaScript is used. 
            </p>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // tealium js loader code
                var object = new Object();

                object['js url'] = document.querySelector('script[src*="utag.js"]').getAttribute('src');

                opReqGetAsync(object, 'Tealium');
            \`\`\`
        `,
        compressed: `var object=new Object;object["js url"]=document.querySelector('script[src*="utag.js"]').getAttribute("src"),opReqGetAsync(object,"Tealium");`
    },
    {
        title: 'Adobe Target Info',
        description: `
            <p>
                This captures the current live mbox's and the campaign name and offer that was returned for an active mbox.
            </p>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // adobe target info
                if(typeof ttMETA != 'undefined') {
                    opReqGetAsync(ttMETA, 'Adobe_Target_Campaigns');
                }
            \`\`\`
        `,
        compressed: `"undefined"!=typeof ttMETA&&opReqGetAsync(ttMETA,"Adobe_Target_Campaigns");`
    },
    {
        title: 'Page Performance Details',
        description: `
            <p>
                Captures all the details about how the page loaded. Includes the following:
            </p>
            <ul>
                <li>DNS timing and Domain connection timing information</li>
                <li>Request and Response timing information</li>
                <li>DOM content load and page load timing information</li>
                <li>Redirection timing information (if the webpage has a redirect)</li>
            </ul>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // page performance details code
                var object = {
                    'DNS-Start': performance.timing.domainLookupStart - performance.timing.domainLookupStart,
                    'DNS-How-long': performance.timing.domainLookupEnd - performance.timing.domainLookupStart,
                    'DNS-Total': performance.timing.domainLookupEnd - performance.timing.domainLookupStart,
                    'Connect-Start': performance.timing.connectStart - performance.timing.domainLookupStart,
                    'Connect-How-long': performance.timing.connectEnd - performance.timing.connectStart,
                    'Connect-Total': performance.timing.connectEnd - performance.timing.domainLookupStart,
                    'Request-Start': performance.timing.requestStart - performance.timing.domainLookupStart,
                    'Response-How-long': performance.timing.responseEnd - performance.timing.requestStart,
                    'Response-Total': performance.timing.responseEnd - performance.timing.domainLookupStart,
                    'DOM_Loading-Start': performance.timing.domLoading - performance.timing.domainLookupStart,
                    'DOM_Interactive-How-long': performance.timing.domInteractive - performance.timing.domLoading,
                    'DOM_Interactive-Total': performance.timing.domInteractive - performance.timing.domainLookupStart,
                    'DOM_Content-Loaded-Start': performance.timing.domContentLoadedEventStart - performance.timing.domainLookupStart,
                    'DOM_Content-Loaded-How-long': performance.timing.domContentLoadedEventEnd - performance.timing.domContentLoadedEventStart,
                    'DOM_Content-Loaded-Total': performance.timing.domContentLoadedEventEnd - performance.timing.domainLookupStart,
                    'Load_Event-Start': performance.timing.loadEventStart - performance.timing.domainLookupStart,
                    'Load_Event-How-long': performance.timing.loadEventEnd - performance.timing.loadEventStart,
                    'Load_Event-Total': performance.timing.loadEventEnd - performance.timing.domainLookupStart
                }

                if (performance.timing.redirectStart && performance.timing.redirectEnd) {
                    object['Redirect-Start'] = performance.timing.redirectStart;
                    object['Redirect-Total'] = performance.timing.redirectEnd;
                    object['Redirect-How-Long'] = performance.timing.redirectEnd - performance.timing.redirectStart;
                } else {
                    var text = 'There is no redirect, or one of the redirects is not of the same origin';
                    object['Redirect-Start'] = text;
                    object['Redirect-Total'] = text;
                    object['Redirect-How-Long'] = text;
                }

                if (performance.timing.loadEventStart && performance.timing.loadEventEnd) {
                    opReqGetAsync(object, 'Page_Performance');
                }
            \`\`\`
        `,
        compressed: `var object={"DNS-Start":performance.timing.domainLookupStart-performance.timing.domainLookupStart,"DNS-How-long":performance.timing.domainLookupEnd-performance.timing.domainLookupStart,"DNS-Total":performance.timing.domainLookupEnd-performance.timing.domainLookupStart,"Connect-Start":performance.timing.connectStart-performance.timing.domainLookupStart,"Connect-How-long":performance.timing.connectEnd-performance.timing.connectStart,"Connect-Total":performance.timing.connectEnd-performance.timing.domainLookupStart,"Request-Start":performance.timing.requestStart-performance.timing.domainLookupStart,"Response-How-long":performance.timing.responseEnd-performance.timing.requestStart,"Response-Total":performance.timing.responseEnd-performance.timing.domainLookupStart,"DOM_Loading-Start":performance.timing.domLoading-performance.timing.domainLookupStart,"DOM_Interactive-How-long":performance.timing.domInteractive-performance.timing.domLoading,"DOM_Interactive-Total":performance.timing.domInteractive-performance.timing.domainLookupStart,"DOM_Content-Loaded-Start":performance.timing.domContentLoadedEventStart-performance.timing.domainLookupStart,"DOM_Content-Loaded-How-long":performance.timing.domContentLoadedEventEnd-performance.timing.domContentLoadedEventStart,"DOM_Content-Loaded-Total":performance.timing.domContentLoadedEventEnd-performance.timing.domainLookupStart,"Load_Event-Start":performance.timing.loadEventStart-performance.timing.domainLookupStart,"Load_Event-How-long":performance.timing.loadEventEnd-performance.timing.loadEventStart,"Load_Event-Total":performance.timing.loadEventEnd-performance.timing.domainLookupStart};if(performance.timing.redirectStart&&performance.timing.redirectEnd)object["Redirect-Start"]=performance.timing.redirectStart,object["Redirect-Total"]=performance.timing.redirectEnd,object["Redirect-How-Long"]=performance.timing.redirectEnd-performance.timing.redirectStart;else{var text="There is no redirect, or one of the redirects is not of the same origin";object["Redirect-Start"]=text,object["Redirect-Total"]=text,object["Redirect-How-Long"]=text}performance.timing.loadEventStart&&performance.timing.loadEventEnd&&opReqGetAsync(object,"Page_Performance");`
    },
    {
        title: 'Find Hard-coded JavaScript Files',
        description: `
            <p>
                Captures all the hard-coded JavaScript files that are not loaded in a tag manager or dynamically.
                This means that you can specify a couple domains to exclude and all other js files are loaded.
            </p>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // find hard-coded javascript files code
                var object = new Object();
                var hardcodedJS = document.querySelectorAll('script:not([src*="' + document.domain + '"]):not([src*="' + document.domain.substring(0, document.domain.indexOf('.')) + '"])');

                for(i = 0; i < hardcodedJS.length; i++) {
                    var jsSRC = hardcodedJS[i].getAttribute('src');
                    
                    if (jsSRC) {
                        jsSRC = jsSRC.replace(/http?s/g, '').replace(/\\/\\\//g, '-').replace(/\\\//g, '-').replace(/:/g, '');
                        object[jsSRC] = 'loaded';
                    }
                }

                opReqGetAsync(object, 'Hard_Coded_JS');
            \`\`\`
        `,
        compressed: `var object=new Object,hardcodedJS=document.querySelectorAll('script:not([src*="'+document.domain+'"]):not([src*="'+document.domain.substring(0,document.domain.indexOf("."))+'"])');for(i=0;i<hardcodedJS.length;i++){var jsSRC=hardcodedJS[i].getAttribute("src");jsSRC&&(object[jsSRC=jsSRC.replace(/http?s/g,"").replace(/\/\//g,"-").replace(/\//g,"-").replace(/:/g,"")]="loaded")}opReqGetAsync(object,"Hard_Coded_JS");`
    },
    {
        title: 'Specific Top JavaScript Files',
        description: `
            <p>
                This will capture if there are hard coded JavaScript files for the vendors Adobe Target,
                Adobe Analytics, SOASTA, Google Analytics, and Google Universal Analytics.
            </p>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // specific top javascript files code
                myInfo = {
                    Page: document.URL,
                    hardcode_Target_found: document.querySelectorAll('[src*="mbox.js"]').length,
                    hardcode_SOASTA_found: document.querySelectorAll('[src*="boomerang/config.js"]').length,
                    hardcode_AA_found: document.querySelectorAll('[src*="s_code.js"],[src*="VisitorAPI.js"],[src*="AppMeasurement.js"]').length,
                    hardcode_GA_found: document.querySelectorAll('script[src*="google-analytics.com/ga.js"]').length,
                    hardcode_GUA_found: document.querySelectorAll('script[src*="google-analytics.com/analytics.js"]').length,
                };

                try {
                    myInfo.visitorAPIversion = visitor.version;
                } catch (err) {
                    myInfo.visitorAPIversion = 'not found';
                }

                try {
                    myInfo.hardcode_Target_scripts = $('[src*="mbox.js"]').map(function() {
                        return $(this).attr('src');
                    }).get();
                } catch (err) {
                    myInfo.hardcode_Target_scripts = 'none';
                }

                try {
                    myInfo.hardcode_SOASTA_scripts = $('[src*="boomerang/config.js"]').map(function() {
                        return $(this).attr('src');
                    }).get();
                } catch (err) {
                    myInfo.hardcode_SOASTA_scripts = 'none';
                }

                try {
                    myInfo.hardcode_AA_scripts = $('[src*="s_code.js"],[src*="VisitorAPI.js"],[src*="AppMeasurement.js"]').map(function() {
                        return $(this).attr('src');
                    }).get();
                } catch (err) {
                    myInfo.hardcode_AA_scripts = 'none';
                }

                try {
                    myInfo.hardcode_GA_scripts = $('script[src*="google-analytics.com/ga.js"]').map(function() {
                        return $(this).attr('src');
                    }).get();
                } catch (err) {
                    myInfo.hardcode_GA_scripts = 'none';
                }

                try {
                    myInfo.hardcode_GUA_scripts = $('script[src*="google-analytics.com/analytics.js"]').map(function() {
                        return $(this).attr('src');
                    }).get();
                } catch (err) {
                    myInfo.hardcode_GUA_scripts = 'none';
                }

                opReqGetAsync(myInfo, 'hardcodeSearch');
            \`\`\`
        `,
        compressed: `myInfo={Page:document.URL,hardcode_Target_found:document.querySelectorAll('[src*="mbox.js"]').length,hardcode_SOASTA_found:document.querySelectorAll('[src*="boomerang/config.js"]').length,hardcode_AA_found:document.querySelectorAll('[src*="s_code.js"],[src*="VisitorAPI.js"],[src*="AppMeasurement.js"]').length,hardcode_GA_found:document.querySelectorAll('script[src*="google-analytics.com/ga.js"]').length,hardcode_GUA_found:document.querySelectorAll('script[src*="google-analytics.com/analytics.js"]').length};try{myInfo.visitorAPIversion=visitor.version}catch(r){myInfo.visitorAPIversion="not found"}try{myInfo.hardcode_Target_scripts=$('[src*="mbox.js"]').map(function(){return $(this).attr("src")}).get()}catch(r){myInfo.hardcode_Target_scripts="none"}try{myInfo.hardcode_SOASTA_scripts=$('[src*="boomerang/config.js"]').map(function(){return $(this).attr("src")}).get()}catch(r){myInfo.hardcode_SOASTA_scripts="none"}try{myInfo.hardcode_AA_scripts=$('[src*="s_code.js"],[src*="VisitorAPI.js"],[src*="AppMeasurement.js"]').map(function(){return $(this).attr("src")}).get()}catch(r){myInfo.hardcode_AA_scripts="none"}try{myInfo.hardcode_GA_scripts=$('script[src*="google-analytics.com/ga.js"]').map(function(){return $(this).attr("src")}).get()}catch(r){myInfo.hardcode_GA_scripts="none"}try{myInfo.hardcode_GUA_scripts=$('script[src*="google-analytics.com/analytics.js"]').map(function(){return $(this).attr("src")}).get()}catch(r){myInfo.hardcode_GUA_scripts="none"}opReqGetAsync(myInfo,"hardcodeSearch");`
    },
    {
        title: 'Tealium Tags & Extensions',
        description: `
            <p>Shows tags that loaded through Tealium.</p>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // tealium tags & extensions code
                var request = new XMLHttpRequest();

                request.onreadystatechange = function() {
                    if(request.readyState === 4 && request.status === 200) {
                        var object = new Object();
                        var companiondata = JSON.parse(request.response);
                        
                        for(var i in utag.send) {
                            var tealTag = companiondata.manage[utag.send[i].id].title;
                            
                            tealTag = tealTag.replace(/ /g, '_').replace(/\/\//g, '-').replace(/\//g, '-').replace(/:/g, '-');
                            object[tealTag] = 'OK';
                        }
                        
                        opReqGetAsync(object, 'Tealium_Tags');
                    }
                };

                var url = 'https://my.tealiumiq.com/urest/legacy/tagcompanion/getProfile?utid=' + utag.cfg.utid

                request.open('GET', url);
                request.send();
            \`\`\`
        `,
        compressed: `var request=new XMLHttpRequest;request.onreadystatechange=function(){if(4===request.readyState&&200===request.status){var e=new Object,t=JSON.parse(request.response);for(var a in utag.send){var r=t.manage[utag.send[a].id].title;e[r=r.replace(/ /g,"_").replace(/\/\//g,"-").replace(/\//g,"-").replace(/:/g,"-")]="OK"}opReqGetAsync(e,"Tealium_Tags")}};var url="https://my.tealiumiq.com/urest/legacy/tagcompanion/getProfile?utid="+utag.cfg.utid;request.open("GET",url),request.send();`
    },
    {
        title: 'Insecure Content',
        description: `
            <p>
                This code checks webpages for insecure content. It collects all images, scripts and links from
                the webpage, and checks if their <code class="inline-code">src</code> or <code class="inline-code">href</code>
                attributes starts from <code class="inline-code">http://...</code>. It also checkes if the
                webpage contains insecure downloads like <code class="inline-code">http://..anything/...filename.pdf</code>. 
                The extensions can be edited for the current website. In this version it looks for PDF / CVS / PPT / DOC / DOCX / XLSX / XLS / TXT,
                and only if the extension is at the end of the string.
            </p>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // insecure content code
                var object = new Object(),
                    page = location.href,
                    allImgs = Object.keys(document.querySelectorAll('img[src]')).map(function(key) {
                        return document.querySelectorAll('img[src]')[key]
                    }),
                    allLinks = Object.keys(document.querySelectorAll('a[href]')).map(function(key) {
                        return document.querySelectorAll('a[href]')[key]
                    }),
                    allScripts = Object.keys(document.querySelectorAll('script[src]')).map(function(key) {
                        return document.querySelectorAll('script[src]')[key]
                    }),
                    regEx = /^https/,
                    regEx2 = /^(http:)+.+\.+(txt|cvs|ppt|pdf|doc|docx|xls|xlsx)$/,
                    unsecureFiles = [],
                    unsecureImgs = [],
                    unsecureLinks = [],
                    unsecureScripts = [];

                for (var i = allImgs.length - 1; i >= 0; i--) {
                    if (allImgs[i].src.search(regEx) == -1) {
                        unsecureImgs.push(allImgs[i].src)
                    }
                }

                for (var i = allScripts.length - 1; i >= 0; i--) {
                    if (allScripts[i].src.search(regEx) == -1) {
                        unsecureScripts.push(allScripts[i].src)
                    }
                }

                if (location.href.search('https://') == -1) {

                    for (var i = allLinks.length - 1; i >= 0; i--) {
                        if (allLinks[i].href.search(regEx) == -1) {
                            unsecureLinks.push(allLinks[i].href)
                        }
                    };
                    for (var i = allLinks.length - 1; i >= 0; i--) {
                        if (allLinks[i].href.search(regEx2) == 0) {
                            unsecureFiles.push(allLinks[i].href)
                        }
                    };
                }

                object.page = location.href;
                object.totalLinks = allLinks.length;
                object.totalImages = allImgs.length;
                unsecureLinks.length == 0 ? object.unsecureLinks = 'no unsecure links found' : object.unsecureLinks = unsecureLinks;
                unsecureImgs.length == 0 ? object.unsecureImages = 'no unsecure images found' : object.unsecureImages = unsecureImgs;
                unsecureFiles.length > 0 ? object.unsecureFiles = unsecureFiles : object.unsecureFiles = 'no unsecure files found';
                unsecureScripts.length > 0 ? object.unsecureScripts = unsecureScripts : object.unsecureScripts = 'no unsecure scripts found';

                opReqGetAsync(object, 'Insecure Content');
            \`\`\`
        `,
        compressed: `for(var object=new Object,page=location.href,allImgs=Object.keys(document.querySelectorAll("img[src]")).map(function(e){return document.querySelectorAll("img[src]")[e]}),allLinks=Object.keys(document.querySelectorAll("a[href]")).map(function(e){return document.querySelectorAll("a[href]")[e]}),allScripts=Object.keys(document.querySelectorAll("script[src]")).map(function(e){return document.querySelectorAll("script[src]")[e]}),regEx=/^https/,regEx2=/^(http:)+.+\.+(txt|cvs|ppt|pdf|doc|docx|xls|xlsx)$/,unsecureFiles=[],unsecureImgs=[],unsecureLinks=[],unsecureScripts=[],i=allImgs.length-1;0<=i;i--)-1==allImgs[i].src.search(regEx)&&unsecureImgs.push(allImgs[i].src);for(i=allScripts.length-1;0<=i;i--)-1==allScripts[i].src.search(regEx)&&unsecureScripts.push(allScripts[i].src);if(-1==location.href.search("https://")){for(i=allLinks.length-1;0<=i;i--)-1==allLinks[i].href.search(regEx)&&unsecureLinks.push(allLinks[i].href);for(i=allLinks.length-1;0<=i;i--)0==allLinks[i].href.search(regEx2)&&unsecureFiles.push(allLinks[i].href)}object.page=location.href,object.totalLinks=allLinks.length,object.totalImages=allImgs.length,0==unsecureLinks.length?object.unsecureLinks="no unsecure links found":object.unsecureLinks=unsecureLinks,0==unsecureImgs.length?object.unsecureImages="no unsecure images found":object.unsecureImages=unsecureImgs,0<unsecureFiles.length?object.unsecureFiles=unsecureFiles:object.unsecureFiles="no unsecure files found",0<unsecureScripts.length?object.unsecureScripts=unsecureScripts:object.unsecureScripts="no unsecure scripts found",opReqGetAsync(object,"Insecure Content");`
    },
    {
        title: 'Open Graph Meta Tags',
        description: `
            <p>This code collects all Open Graph meta tags.</p>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // open graph meta tags code
                var meta = document.querySelectorAll('meta[property*="og:"]');
                var result = [];
                var obj = {};

                if (meta.length > 0) {
                    for (var i = meta.length - 1; i >= 0; i--) {
                        obj[meta[i].getAttribute('property')] = meta[i].getAttribute('content');
                    }
                    
                    obj.metaTagsLength = result.length;
                } else {
                    obj.metaOPTagsContent = null;
                }

                opReqGetAsync(obj, 'Open_Graph')
            \`\`\`
        `,
        compressed: `var meta=document.querySelectorAll('meta[property*="og:"]'),result=[],obj={};if(0<meta.length){for(var i=meta.length-1;0<=i;i--)obj[meta[i].getAttribute("property")]=meta[i].getAttribute("content");obj.metaTagsLength=result.length}else obj.metaOPTagsContent=null;opReqGetAsync(obj,"Open_Graph");`
    },
    {
        title: 'Ensighten Tag Management Rules',
        description: `
            <p>This code sends to ObservePoint an object with rules, ordered by Ensighten tag managment system.</p>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // ensighten tag management rules code
                var obj = {},
                    ensObject = window['ensBootstraps'];

                obj.page = location.href;

                if (typeof ensObject == 'object') {
                    obj.results = ensObject.Bootstrapper.data.getAllDataDefinitionsOnCurrentPage_S_C_N();
                    obj.status = 'ensighten object found';
                    obj.rulesFound = obj.results.length;
                } else {
                    obj.status = 'ensighten object not found on current page';
                }

                opReqGetAsync(obj, 'ensighten rules');
            \`\`\`
        `,
        compressed: `var obj={},ensObject=window.ensBootstraps;obj.page=location.href,"object"==typeof ensObject?(obj.results=ensObject.Bootstrapper.data.getAllDataDefinitionsOnCurrentPage_S_C_N(),obj.status="ensighten object found",obj.rulesFound=obj.results.length):obj.status="ensighten object not found on current page",opReqGetAsync(obj,"ensighten rules");`
    },
    {
        title: 'Signal BrightTag Tag Management Rules',
        description: `
            <p>This code sends to ObservePoint an object with rules, ordered by Signal tag managment system.</p>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // signal brighttag tag management rules code
                var obj = {},
                brightTagObj = window['BrightTag'];

            obj.page  = location.href;

            if(typeof brightTagObj == 'object'){
                obj.results = BrightTag.configuredSites()[0].config;
                obj.page  = location.href;
                obj.status = 'BrightTag object found';
                obj.rulesFound = obj.results.length;
                
            } else {
                obj.status = 'BrightTag object not found on current page';
            }

            opReqGetAsync(obj, 'Signal rules');
            \`\`\`
        `,
        compressed: `var obj={},brightTagObj=window.BrightTag;obj.page=location.href,"object"==typeof brightTagObj?(obj.results=BrightTag.configuredSites()[0].config,obj.page=location.href,obj.status="BrightTag object found",obj.rulesFound=obj.results.length):obj.status="BrightTag object not found on current page",opReqGetAsync(obj,"Signal rules");`
    },
    {
        title: 'Optimizely A/B Testing',
        description: `
            <p>This code captures Optimizely A/B testing rules.</p>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // optimizely a/b testing rules code
                var object = {},
                    rules = {},
                    optimizelyObject = window['optimizely'];

                object.page = location.href;
                object.optimizelyObj = 'not found';


                if (typeof optimizelyObject == 'object') {
                    object.optimizelyObj = 'found';

                    var experiments = window.optimizely.allExperiments,
                        variations = window.optimizely.data.variations,
                        keys = Object.keys(experiments);

                    for (var i = keys.length - 1; i >= 0; i--) {
                        var option = experiments[keys[i]].enabled_variation_ids;

                        for (var j = option.length - 1; j >= 0; j--) {

                            rules[option[j]] = variations[option[j]];
                        }

                    }

                    object.amount = Object.keys(rules).length;
                    object.enabledRules = rules;
                }

                opReqGetAsync(object, 'Optimizely_data_object');
            \`\`\`
        `,
        compressed: `var object={},rules={},optimizelyObject=window.optimizely;if(object.page=location.href,object.optimizelyObj="not found","object"==typeof optimizelyObject){object.optimizelyObj="found";for(var experiments=window.optimizely.allExperiments,variations=window.optimizely.data.variations,keys=Object.keys(experiments),i=keys.length-1;0<=i;i--)for(var option=experiments[keys[i]].enabled_variation_ids,j=option.length-1;0<=j;j--)rules[option[j]]=variations[option[j]];object.amount=Object.keys(rules).length,object.enabledRules=rules}opReqGetAsync(object,"Optimizely_data_object");`
    },
    {
        title: 'Responsive Website Test',
        description: `
            <p>
                This script checks to see if the website is responsive or not.If so it identifies the
                number of CSS rules for each width option of the display.
            </p>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // response website test code
                var meta = document.querySelector('meta[name*="viewport"]'),
                    object = {};

                object.page = location.href;
                object.responsive = false;

                if (meta) {
                    var styles = document.styleSheets,
                        responsiveRules = [];
                    
                    object.responsive = true;

                    for (var i = styles.length - 1; i >= 0; i--) {
                        try {
                            if (styles[i].cssRules) {
                                for (var j = styles[i].cssRules.length - 1; j >= 0; j--) {
                                    if (styles[i].cssRules[j].cssText.search(/^@media+.+\((min|max)-width: /g) !== -1) {
                                        responsiveRules.push(styles[i].cssRules[j].cssText)
                                    }
                                };
                            }
                        } catch (e) {
                            continue;
                        }
                    }
                    
                    object.cssRules = responsiveRules.length;
                }

                opReqGetAsync(object, 'Responsive_test');
            \`\`\`
        `,
        compressed: `var meta=document.querySelector('meta[name*="viewport"]'),object={};if(object.page=location.href,object.responsive=!1,meta){var styles=document.styleSheets,responsiveRules=[];object.responsive=!0;for(var i=styles.length-1;0<=i;i--)try{if(styles[i].cssRules)for(var j=styles[i].cssRules.length-1;0<=j;j--)-1!==styles[i].cssRules[j].cssText.search(/^@media+.+\((min|max)-width: /g)&&responsiveRules.push(styles[i].cssRules[j].cssText)}catch(e){continue}object.cssRules=responsiveRules.length}opReqGetAsync(object,"Responsive_test");`
    },
    {
        title: 'Insecure Content v2',
        description: `
            <p>This script will search through a much higher number of requests for non secure requests.</p>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // insecure content v2 code
                var Links = [];
                var Locations = [];
                var badRequests = [];
                var object = {};
                var requests = window.performance.getEntries().filter(function(el) {
                    return (el.entryType === 'resource');
                });

                for (i = 1; i < requests.length; i++) {
                    if (requests[i].name.substring(0, 5) != 'https') {
                        badRequests.push(requests[i].name);
                    }
                }

                if (badRequests.length > 0) {
                    object.failed = 'true';
                    object.nonSecure_Requests = badRequests;
                    opReqGetAsync(object, 'Non_Secure_Requests');
                }
            \`\`\`
        `,
        compressed: `var Links=[],Locations=[],badRequests=[],object={},requests=window.performance.getEntries().filter(function(e){return"resource"===e.entryType});for(i=1;i<requests.length;i++)"https"!=requests[i].name.substring(0,5)&&badRequests.push(requests[i].name);0<badRequests.length&&(object.failed="true",object.nonSecure_Requests=badRequests,opReqGetAsync(object,"Non_Secure_Requests"));`
    },
    {
        title: 'Tag Performance',
        description: `
            <p>
                This will capture the load time of a specific tag or resource loaded on the page.
                The purpose of this script is to enable the building of rules around individual
                tag load times. Separate instances of this script must be created if you wish to
                capture load times for multiple tags. The following tag parameters must be customized
                for each specific tag you wish to evaluate:
            </p>
            <ul>
                <li>line 2  -  <code class="inline-code">'Tag-Name': '-- enter name of tag here --'</code></li>
                <li>line 30  -  <code class="inline-code">if(winTiming[i].name.indexOf('-- enter string unique to targeted tag here --') > 0)</code></li>
            </ul>
            <p>
                If this script is not customized it will default to the first Adobe Analytics tag fired
                on each page.
            </p>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // tag performance code
                var object = {
                    'Tag-Name': 'Adobe Analytics',
                }

                var winTiming = window.performance.getEntriesByType('resource');

                if (winTiming.length > 0) {
                    for (i = 0; i < winTiming.length; i++) {
                        if (winTiming[i].name.indexOf('b/ss') > 0) {
                            object['Tag-Load-Time'] = winTiming[i].duration.toFixed(0);
                            break;
                        } else {
                            object['Tag-Load-Time'] = 'empty';
                        }
                    }
                }

                if (winTiming.length > 0) {
                    opReqGetAsync(object, 'Tag_Performance');
                }
            \`\`\`
        `,
        compressed: `var object={"Tag-Name":"Adobe Analytics"},winTiming=window.performance.getEntriesByType("resource");if(0<winTiming.length)for(i=0;i<winTiming.length;i++){if(0<winTiming[i].name.indexOf("b/ss")){object["Tag-Load-Time"]=winTiming[i].duration.toFixed(0);break}object["Tag-Load-Time"]="empty"}0<winTiming.length&&opReqGetAsync(object,"Tag_Performance");`
    },
    {
        title: 'Links List',
        description: `
            <p>
                This script captures a simple inventory of all anchor tag links on the page (it does not click on
                links, only inventories them). Captures the count of anchor tags and the list of href attributes.
            </p>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // links list code
                var links = document.getElementsByTagName('a'),
                    allLinks = [];

                for (var i = 0; i < links.length; i++) {
                    if (links[i].href != '') {
                        allLinks.push(links[i].href);
                    } else {
                        allLinks.push(links[i].innerHTML);
                    }
                }

                allLinks = allLinks.join(', ');

                var obj = {
                    'Link_Count': links.length,
                    'Links_List': allLinks
                }

                opReqGetAsync(obj, 'Links_List');
            \`\`\`
        `,
        compressed: `for(var links=document.getElementsByTagName("a"),allLinks=[],i=0;i<links.length;i++)""!=links[i].href?allLinks.push(links[i].href):allLinks.push(links[i].innerHTML);allLinks=allLinks.join(", ");var obj={Link_Count:links.length,Links_List:allLinks};opReqGetAsync(obj,"Links_List");`
    }, {
        title: 'Collect Network Request URLs',
        description: `
            <p>
                Collects all the URLs made from the website.
            </p>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // collect network request urls code
                var arr = window.performance.getEntries();
                var resultArr = [];

                for (var i = arr.length - 1; i >= 0; i--) {
                    if (arr[i].name.indexOf('http') === 0) resultArr.push(arr[i].name)
                }

                opReqGetAsync(resultArr, 'Network_Urls');
            \`\`\`
        `,
        compressed: `for(var arr=window.performance.getEntries(),resultArr=[],i=arr.length-1;0<=i;i--)0===arr[i].name.indexOf("http")&&resultArr.push(arr[i].name);opReqGetAsync(resultArr,"Network_Urls");`
    },
    {
        title: 'Google Link Attr',
        description: `
            <p>Collects links missing the correct attributes for Google.</p>
        `,
        code: `
            \`\`\`javascript
                // base function
                function opReqGetAsync(paramObject, acct, callback) {
                    var baseURL = 'https://opreq.observepoint.com/?acct=' + acct;
                    var opReq = new XMLHttpRequest();
                    
                    opReq.onreadystatechange = function() {
                        if(opReq.readyState == 4 && opReq.status == 200) {
                            callback(opReq.responseText);
                        }
                    }
                    
                    opReq.open('POST', baseURL, true);
                    opReq.send(JSON.stringify(paramObject));
                }

                // google link attr code
                function toArray(obj) {
                var array = [];
                
                // iterate backwards ensuring that length is an UInt32
                for (var i = obj.length >>> 0; i--;) {
                    array[i] = obj[i];
                }
                
                return array;
            }

            var links = toArray(document.querySelectorAll('a'));
            var attr = toArray(document.querySelectorAll('a[data-g-action][data-g-event][data-g-label]'));
            var objectAttr = {};

            objectAttr.failed = [];

            for (k = 0; k < links.length; k++) {
                if (attr.indexOf(links[k]) == -1) {
                    objectAttr.failed.push(links[k].outerHTML);
                }
            }

            opReqGetAsync(objectAttr, 'data-g-ATTR');
            \`\`\`
        `,
        compressed: `function toArray(t){for(var e=[],r=t.length>>>0;r--;)e[r]=t[r];return e}var links=toArray(document.querySelectorAll("a")),attr=toArray(document.querySelectorAll("a[data-g-action][data-g-event][data-g-label]")),objectAttr={failed:[]};for(k=0;k<links.length;k++)-1==attr.indexOf(links[k])&&objectAttr.failed.push(links[k].outerHTML);opReqGetAsync(objectAttr,"data-g-ATTR");`
    }
];