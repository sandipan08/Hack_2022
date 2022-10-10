/**
*@NApiVersion 2.1
*@NScriptType Suitelet
*/
define(['N/ui/serverWidget', 'N/xml', 'N/log', 'N/render', 'N/record'],
    function (serverWidget, xml, log, render, record)
    {
        function onRequest(context)
        {
            if (context.request.method === 'GET')
            {
                {
                    var id = context.request.parameters.recordname;
                    log.debug({ title: 'PCT-Bunker', details: "Record Id " + id });
                    var load_record = record.load({ type: 'itemreceipt', id: id })

                    var myvar = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                        "<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n" +
                        '<pdf>' +
                        '<head>' +
                        "<link name=\"russianfont\" type=\"font\" subtype=\"opentype\" " + "src=\"NetSuiteFonts/verdana.ttf\" " + "srcbold=\"NetSuiteFonts/verdanab.ttf\" " + "src-italic=\"NetSuiteFonts/verdanai.ttf\" " +
                        "src-bolditalic=\"NetSuiteFonts/verdan abi.ttf\" " + "bytes=\"2\"/>\n" +
                        '<style type="text/css">* {' +
                        '' +
                        '		}' +
                        '		table {' +
                        '            font-size: 7pt;' +
                        '            margin-top: 10px;' +
                        '            table-layout: fixed;' +
                        '            page-break-inside: avoid;' +
                        '          	text-align:left;' +
                        '          	border-spacing: 15px;' +
                        '        }' +
                        ' h3 {font-weight: bold ; font-style: italic}' +
                        ' h4 {font-weight: bold; font-style: italic; font-size: 0.9em }' +
                        // '.barcode {' +
                        // '    color: #000044;' +
                        // '}' +
                        '</style>' +
                        '</head>';

                    var item_count = load_record.getLineCount({ sublistId: 'item' });
                    log.debug({ title: 'PCT-Bunker', details: "Total Item in Item Receipt " + item_count });
                    for (var item_index = 0; item_index < item_count; item_index++)
                    {
                        var item_id = load_record.getSublistText({
                            sublistId: 'item',
                            fieldId: 'item',
                            line: item_index
                        });
                        var item_qty = load_record.getSublistText({
                            sublistId: 'item',
                            fieldId: 'itemquantity',
                            line: item_index
                        });

                        log.debug({ title: "PCT-Bunker", details: "Item Id :" + item_id + " Item Quantity :" + item_qty });
                        var item_record = record.load({ type: 'inventoryitem', id: item_id }) //Load Item Record 
                        var item_name = item_record.getValue({ fieldId: 'itemid' });
                        var item_upc = item_record.getValue({ fieldId: 'upccode' });
                        if (item_upc == "")
                        {
                            item_upc = item_id;
                        }
                        log.debug({ title: "PCT-Bunker", details: "Item Details ( Item Name : " + item_name + " , Item UPC Code :" + item_upc + " )" });
                        var item_price = item_record.getSublistValue({
                            sublistId: 'price1',
                            fieldId: 'price_1_',
                            line: 0
                        });
                        var item_msrp_price = item_record.getSublistValue({
                            sublistId: 'price1',
                            fieldId: 'price_1_',
                            line: 4
                        });
                        log.debug({ title: "PCT-Bunker", details: "Item Price :" + item_price + ", Item MSRP Price :" + item_msrp_price });

                        if (item_msrp_price > item_price)
                        {
                            item_msrp_price = "";
                        }

                        for (var label_count = 0; label_count < item_qty; label_count++)
                        {
                            myvar += '<body padding="1px" width="2.50in" height="1.25in">' +
                                '<table style="width:100%;"><tr style="background-color:BLACK; color:white;">' +
                                '<td colspan="2" style="align : center;">' +
                                '<h2>THE BUNKER</h2>' +
                                '</td>' +
                                '</tr>' +
                                '<tr><!--<td>' +
                                '<h3>' +
                                '$14<sup>95</sup>' +
                                '</h3>' +
                                '</td>-->' +
                                '<td>' +
                                '<h1>$' + item_price + '</h1>' +
                                '</td>';


                            if (item_name.length > 20)
                            {
                                myvar += '<td margin-left="-35px">' + '<h4>' + item_name + '</h4>' +
                                    '</td>';
                            }
                            else
                            {
                                myvar += '<td margin-left="-35px">' + '<h3>' + item_name + '</h3>' +
                                    '</td>';
                            }
                            myvar += '</tr>' +
                                '<tr>' +
                                '<td>' +
                                '<h3>MSRP : ' + item_msrp_price + ' </h3>' +
                                '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td border-spacing="15px">' +
                                '<barcode class="barcode" horizantal-align="center" vertical-align="middle"  bar-width="1.10" codetype="Code128" showtext="true" value="' + item_upc + '"></barcode>' +
                                '</td>' +
                                '</tr>' +
                                '</table>' +
                                '</body>';
                        }
                    }
                    myvar += '</pdf>';
                    context.response.renderPdf(myvar);
                }
            }
        }

        return {
            onRequest: onRequest,
        };
    });
