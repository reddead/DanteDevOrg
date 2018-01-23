$(window).load(
    function() {
        if (typeof apiSessionID === "undefined")
            window.location.href = '/CommunitiesLogin';
    });
