/*globals jQuery, window */
(function($) {
    $.retryAjax = function (ajaxParams) {
        var failCallback;
        ajaxParams.tryCount = (!ajaxParams.tryCount) ? 0 : ajaxParams.tryCount;
        ajaxParams.retryLimit = (!ajaxParams.retryLimit) ? 2 : ajaxParams.retryLimit;
        // Cant see how this code has any effect??
        ajaxParams.suppressErrors = true;

        if (ajaxParams.error) {
            failCallback = ajaxParams.fail;
            delete ajaxParams.fail;
        } else {
            failCallback = function () {};
        }

        ajaxParams.always = function (jqXHR, textStatus) {
            if ($.inArray(textStatus, ['timeout', 'abort', 'error']) > -1) {
                this.tryCount++;
                if (this.tryCount <= this.retryLimit) {

                    // fire error handling on the last try
                    if (this.tryCount === this.retryLimit) {
                        this.fail = failCallback;
                        // Cant see how this code has any effect??
                        delete this.suppressErrors;
                    }

                    //try again
                    $.ajax(this);
                    // not sure why we are returning.. to who?
                    return true;
                }

                window.alert('There was a server error.  Please refresh the page.  If the issue persists, give us a call. Thanks!');
                // not sure why we are returning.. to who? - Even if we are, should this be false??
                return true;
            }
        };

        $.ajax(ajaxParams);
    };
}(jQuery));
