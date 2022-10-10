/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */
define(['N/record', 'N/log', 'N/url', 'N/redirect'], function (record, log, url, redirect)
{

    function beforeLoad(context)
    {
        var recId = context.newRecord.id;
        log.debug({ title: 'PCT-Bunker', details: "Record Id " + recId });

        // log.debug({
        //     title: 'PCT-Bunker',
        //     details: 'Before Load'
        // });

        if (context.type == context.UserEventType.VIEW)
        {
            context.form.addButton({
                id: 'custpage_suiteletbutton',
                label: 'Print Item Receipt ',
                functionName: 'window.open(\"https://tstdrv2211536.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1872&recordname=' + recId + '&deploy=2")'
                //   functionName: 'window.open(\"https://6262171.app.netsuite.com/app/site/hosting/scriptlet.nl?script=578&deploy=1&recId=' + Rec_id + '\")'
            });

        }

    }

    return {
        beforeLoad: beforeLoad
    }
});

