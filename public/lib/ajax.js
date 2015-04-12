function ajax(args, cb) {
    _ajax(args.method, args.url, args.headers, args.body, cb)

    // # cb(status, headers, body)
    function _ajax(method, url, headers, body, cb) {
        cb = cb || function() {}
        var req = new XMLHttpRequest()
        req.onreadystatechange = onChange
        req.open(method, url)
        // 设置各个头部字段
        if (headers) {
            headers.forEach(function(header) {
                req.setRequestHeader(header[0], header[1])
            })
        }
        if (body) {
            req.send(body)
        }
        else {
            req.send()
        }
        return req
        
        function onChange() {
            if (req.readyState !== 4) {
                return
            }
            var status = {
                code: req.status,
                text: req.statusText
            }
            var headers = req.getAllResponseHeaders()
            cb(status, headers, req.responseText)
        }
    }
}