/*!
 * Piwik - free/libre analytics platform
 *
 * Screenshot integration tests.
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

describe("UIIntegrationTest", function () { // TODO: Rename to Piwik?
    this.timeout(0);

    var generalParams = 'idSite=1&period=year&date=2012-08-09',
        idSite2Params = 'idSite=2&period=year&date=2012-08-09',
        evolutionParams = 'idSite=1&period=day&date=2012-01-31&evolution_day_last_n=30',
        urlBase = 'module=CoreHome&action=index&' + generalParams,
        widgetizeParams = "module=Widgetize&action=iframe",
        segment = encodeURIComponent("browserCode==FF") // from OmniFixture
        ;

    before(async function () {
        testEnvironment.queryParamOverride = {
            forceNowValue: testEnvironment.forcedNowTimestamp,
            visitorId: testEnvironment.forcedIdVisitor,
            realtimeWindow: 'false'
        };
        testEnvironment.save();

        testEnvironment.callApi("SitesManager.setSiteAliasUrls", {idSite: 3, urls: []});
    });

    beforeEach(function () {
        if (testEnvironment.configOverride.database) {
            delete testEnvironment.configOverride.database;
        }
        testEnvironment.testUseMockAuth = 1;
        testEnvironment.save();
    });

    after(function () {
        delete testEnvironment.queryParamOverride;
        testEnvironment.testUseMockAuth = 1;
        testEnvironment.save();
    });
    
    // dashboard tests
    it("should load dashboard1 correctly", async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=Dashboard_Dashboard&subcategory=1");
        await page.waitForNetworkIdle();
        await page.evaluate(function () {
            // Prevent random sizing error eg. http://builds-artifacts.piwik.org/ui-tests.master/2301.1/screenshot-diffs/diffviewer.html
            $("[widgetid=widgetActionsgetOutlinks] .widgetContent").text('Displays different at random -> hidden');
        });

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('dashboard1');
    });

    it("should load dashboard2 correctly", async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=Dashboard_Dashboard&subcategory=2");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('dashboard2');
    });

    it("should load dashboard3 correctly", async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=Dashboard_Dashboard&subcategory=3");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('dashboard3');
    });

    it("should load dashboard4 correctly", async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=Dashboard_Dashboard&subcategory=4");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('dashboard4');
    });

    it("should display dashboard correctly on a mobile phone", async function () {
        await page.webpage.setViewport({
            width: 480,
            height: 320
        });
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=Dashboard_Dashboard&subcategory=5");
        await page.waitForNetworkIdle();

        expect(await page.screenshot({ fullPage: true })).to.matchImage('dashboard5_mobile');

        await page.webpage.setViewport({
            width: 1350,
            height: 768
        });
    });

    // shortcuts help
    it("should show shortcut help", async function () {
        await page.setUserAgent("Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36");
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=Dashboard_Dashboard&subcategory=1");
        await page.waitForNetworkIdle();
        await page.keyboard.press('?');

        modal = await page.$('.modal.open');
        expect(await modal.screenshot()).to.matchImage('shortcuts');
    });

    // visitors pages
    it('should load visitors > overview page correctly', async function () {
        // use columns query param to make sure columns works when supplied in URL fragment
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=General_Visitors&subcategory=General_Overview&columns=nb_visits,nb_actions");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('visitors_overview');
    });

    it('should reload the visitors > overview page when clicking on the visitors overview page element again', async function () {
        await page.click('#VisitsSummary_index > a.item');
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('visitors_overview');
    });

    // skipped as phantom seems to crash at this test sometimes
    it.skip('should load visitors > visitor log page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=General_Visitors&subcategory=Live_VisitorLog");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('visitors_visitorlog');
    });

    // this test often fails for unknown reasons? 
    // the visitor log with site search is also currently tested in plugins/Live/tests/UI/expected-ui-screenshots/Live_visitor_log.png
    it.skip('should load visitors with site search > visitor log page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=General_Visitors&subcategory=Live_VisitorLog&period=day&date=2012-01-11");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('visitors_with_site_search_visitorlog');
    });

    it('should load the visitors > devices page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=General_Visitors&subcategory=DevicesDetection_Devices");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('visitors_devices');
    });

    it('should load visitors > locations & provider page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=General_Visitors&subcategory=UserCountry_SubmenuLocations");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('visitors_locations_provider');
    });

    it('should load the visitors > software page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=General_Visitors&subcategory=DevicesDetection_Software");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('visitors_software');
    });

    it('should load the visitors > times page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=General_Visitors&subcategory=VisitTime_SubmenuTimes");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('visitors_times');
    });

    it('should load the visitors > engagement page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=General_Visitors&subcategory=VisitorInterest_Engagement");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('visitors_engagement');
    });

    it('should load the visitors > custom variables page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=General_Visitors&subcategory=CustomVariables_CustomVariables");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('visitors_custom_vars');
    });

    it('should load the visitors > real-time map page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + idSite2Params + "&category=General_Visitors&subcategory=UserCountryMap_RealTimeMap"
                    + "&showDateTime=0&realtimeWindow=last2&changeVisitAlpha=0&enableAnimation=0&doNotRefreshVisits=1"
                    + "&removeOldVisits=0");
        await page.waitForNetworkIdle();
        circle = await page.$('circle');
        await circle.hover();
        await page.evaluate(function(){
            $('.ui-tooltip:visible .rel-time').data('actiontime', Math.floor(new Date((new Date()).getTime()-(4*3600*24000))/1000));
        });

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('visitors_realtime_map');
    });

    // actions pages
    it('should load the actions > pages page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=General_Actions&subcategory=General_Pages");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('actions_pages');
    });

    // actions pages
    it('should load the actions > pages help tooltip, including the "Report generated time"', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=General_Actions&subcategory=General_Pages");
        await page.waitForNetworkIdle();
        elem = await page.$('[piwik-enriched-headline]');
        await elem.hover();
        await page.click('.helpIcon');
        await page.evaluate(function () {
            $('.helpDate:visible').hide();
        });

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('actions_pages_tooltip_help');
    });

    it('should load the actions > entry pages page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=General_Actions&subcategory=Actions_SubmenuPagesEntry", 2000);
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('actions_entry_pages');
    });

    it('should load the actions > exit pages page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=General_Actions&subcategory=Actions_SubmenuPagesExit", 2000);
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('actions_exit_pages');
    });

    it('should load the actions > page titles page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=General_Actions&subcategory=Actions_SubmenuPageTitles");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('actions_page_titles');
    });

    it('should load the actions > site search page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=General_Actions&subcategory=Actions_SubmenuSitesearch");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('actions_site_search');
    });

    it('should load the actions > outlinks page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=General_Actions&subcategory=General_Outlinks", 1500);
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('actions_outlinks');
    });

    it('should load the actions > downloads page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=General_Actions&subcategory=General_Downloads");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('actions_downloads');
    });

    it('should load the actions > contents page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=General_Actions&subcategory=Contents_Contents&period=day&date=2012-01-01");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('actions_contents');
    });

    it("should show all corresponding content pieces when clicking on a content name", async function () {
        await page.click('.dataTable .subDataTable .value:contains(ImageAd)');
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('actions_content_name_piece');
    });

    it("should show all tracked content pieces when clicking on the table", async function () {
        await page.click('.reportDimension .dimension:contains(Content Piece)');
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('actions_content_piece');
    });

    it("should show all corresponding content names when clicking on a content piece", async function () {
        await page.click('.dataTable .subDataTable .value:contains(Click NOW)');
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('actions_content_piece_name');
    });

    // referrers pages
    it('should load the referrers > overview page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=Referrers_Referrers&subcategory=General_Overview");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('referrers_overview');
    });

    // referrers pages
    it('should load the referrers > overview page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=Referrers_Referrers&subcategory=Referrers_WidgetGetAll");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('referrers_allreferrers');
    });

    it('should display metric tooltip correctly', async function () {
        elem = await page.$('[data-report="Referrers.getReferrerType"] #nb_visits .thDIV');
        await elem.hover();

        pageWrap = await page.$('.pageWrap,.columnDocumentation:visible');
        expect(await pageWrap.screenshot()).to.matchImage('metric_tooltip');
    });

    it('should load the referrers > search engines & keywords page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=Referrers_Referrers&subcategory=Referrers_SubmenuSearchEngines");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('referrers_search_engines_keywords');
    });

    it('should load the referrers > websites correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=Referrers_Referrers&subcategory=Referrers_SubmenuWebsitesOnly");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('referrers_websites');
    });

    it('should load the referrers > social page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=Referrers_Referrers&subcategory=Referrers_Socials");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('referrers_socials');
    });

    it('should load the referrers > campaigns page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=Referrers_Referrers&subcategory=Referrers_Campaigns");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('referrers_campaigns');
    });

    // goals pages
    it('should load the goals > ecommerce page correctly', async function () {
        await page.goto( "?" + urlBase + "#?" + generalParams + "&category=Goals_Ecommerce&subcategory=General_Overview")
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap,.dataTable');
        expect(await pageWrap.screenshot()).to.matchImage('goals_ecommerce');
    });

    it('should load the goals > overview page correctly', async function () {
        await page.goto( "?" + urlBase + "#?" + generalParams + "&category=Goals_Goals&subcategory=General_Overview");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap,.dataTable');
        expect(await pageWrap.screenshot()).to.matchImage('goals_overview');
    });

    it('should load the goals > management page correctly', async function () {
        await page.goto("?" + generalParams + "&module=Goals&action=manage");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('#content,.top_bar_sites_selector,.entityContainer');
        expect(await pageWrap.screenshot()).to.matchImage('goals_overview');
    });

    it('should load the goals > single goal page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=Goals_Goals&subcategory=1");
        await page.waitForNetworkIdle();

        pageWrap = await page.$('.pageWrap,.dataTable');
        expect(await pageWrap.screenshot()).to.matchImage('goals_individual_goal');
    });

    it('should update the evolution chart if a sparkline is clicked', async function () {
        await page.click('.sparkline.linked:contains(%)');

        pageWrap = await page.$('.pageWrap,.dataTable');
        expect(await pageWrap.screenshot()).to.matchImage('goals_individual_goal_updated');
    });

    // should load the row evolution [see #11526]
    it('should show rov evolution for goal tables', async function () {
        await page.click('table.dataTable tbody tr:first-child a.actionRowEvolution');
        await page.waitForNetworkIdle();

        dialog = await page.$('.ui-dialog');
        expect(await dialog.screenshot()).to.matchImage('goals_individual_row_evolution');
    });

    // Events pages
    it('should load the Events > index page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=General_Actions&subcategory=Events_Events");

        pageWrap = await page.$('.pageWrap,.dataTable');
        expect(await pageWrap.screenshot()).to.matchImage('events_overview');
    });

    // one page w/ segment
    it('should load the visitors > overview page correctly when a segment is specified', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=General_Visitors&subcategory=General_Overview&segment=" + segment);

        pageWrap = await page.$('.pageWrap,.top_controls');
        expect(await pageWrap.screenshot()).to.matchImage('visitors_overview_segment');
    });

    // example ui pages
    it('should load the example ui > dataTables page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=ExampleUI_UiFramework&subcategory=ExampleUI_GetTemperaturesDataTable");

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('exampleui_dataTables');
    });

    it('should load the example ui > barGraph page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=ExampleUI_UiFramework&subcategory=Bar%20graph");

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('exampleui_barGraph');
    });

    it('should load the example ui > pieGraph page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=ExampleUI_UiFramework&subcategory=Pie%20graph");

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('exampleui_pieGraph');
    });

    it('should load the example ui > tagClouds page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=ExampleUI_UiFramework&subcategory=Tag%20clouds");

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('exampleui_tagClouds');
    });

    it('should load the example ui > sparklines page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=ExampleUI_UiFramework&subcategory=Sparklines");

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('exampleui_sparklines');
    });

    it('should load the example ui > evolution graph page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=ExampleUI_UiFramework&subcategory=Evolution%20Graph");

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('exampleui_evolutionGraph');
    });

    it('should load the example ui > treemap page correctly', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=ExampleUI_UiFramework&subcategory=Treemap");

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('exampleui_treemap');
    });

    // widgetize
    it('should load the widgetized visitor log correctly', async function () {
        await page.goto("?" + widgetizeParams + "&" + generalParams + "&moduleToWidgetize=Live&actionToWidgetize=getVisitorLog");
        await page.evaluate(function () {
            $('.expandDataTableFooterDrawer').click();
        });
        await page.waitForNetworkIdle();

        expect(await page.screenshot({ fullPage: true })).to.matchImage('widgetize_visitor_log');
    });

    it('should load the widgetized all websites dashboard correctly', async function () {
        await page.goto("?" + widgetizeParams + "&" + generalParams + "&moduleToWidgetize=MultiSites&actionToWidgetize=standalone");
        await page.waitForNetworkIdle();

        expect(await page.screenshot({ fullPage: true })).to.matchImage('widgetize_allwebsites');
    });

    it('should widgetize the ecommerce log correctly', async function () {
        await page.goto("?" + widgetizeParams + "&" + generalParams + "&moduleToWidgetize=Ecommerce&actionToWidgetize=getEcommerceLog&filter_limit=-1");

        expect(await page.screenshot({ fullPage: true })).to.matchImage('widgetize_ecommercelog');
    });

    // Do not allow API response to be displayed
    it('should not allow to widgetize an API call', async function () {
        await page.goto("?" + widgetizeParams + "&" + generalParams + "&moduleToWidgetize=API&actionToWidgetize=index&method=SitesManager.getImageTrackingCode&piwikUrl=test");

        expect(await page.screenshot({ fullPage: true })).to.matchImage('widgetize_apidisallowed');
    });

    it('should not display API response in the content and redirect to dashboard instead', async function () {
        expect.page().contains('#dashboardWidgetsArea', /*'menu_apidisallowed',*/ function (page) {
            var url = "?" + urlBase + "#?" + generalParams + "&module=API&action=SitesManager.getImageTrackingCode";
            page.goto(url, 2000);
        }, done);
    });

    // Ecommerce
    it('should load the ecommerce overview page', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=Goals_Ecommerce&subcategory=General_Overview");

        pageWrap = await page.$('.pageWrap,.dataTable');
        expect(await pageWrap.screenshot()).to.matchImage('ecommerce_overview');
    });

    it('should load the ecommerce log page', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=Goals_Ecommerce&subcategory=Goals_EcommerceLog");

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('ecommerce_log');
    });

    it('should load the ecommerce log page with segment', async function () {
        await page.goto("?" + urlBase + "&segment=countryCode%3D%3DUS#?" + generalParams + "&category=Goals_Ecommerce&subcategory=Goals_EcommerceLog&segment=countryCode%3D%3DUS");

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('ecommerce_log_segmented');
    });

    it('should load the ecommerce products page', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=Goals_Ecommerce&subcategory=Goals_Products");

        pageWrap = await page.$('.pageWrap,.dataTable');
        expect(await pageWrap.screenshot()).to.matchImage('ecommerce_products');
    });

    it('should load the ecommerce sales page', async function () {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=Goals_Ecommerce&subcategory=Ecommerce_Sales");

        pageWrap = await page.$('.pageWrap,.dataTable');
        expect(await pageWrap.screenshot()).to.matchImage('ecommerce_sales');
    });

    it('should load the Admin home page correct', async function () {
        await page.goto("?" + generalParams + "&module=CoreAdminHome&action=home");

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('admin_home');
    });

    // Admin user settings (plugins not displayed)
    it('should load the Manage > Websites admin page correctly', async function () {
        await page.goto("?" + generalParams + "&module=SitesManager&action=index");
        await page.evaluate(function () {
            $('.form-help:contains(UTC time is)').hide();
        });

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('admin_manage_websites');
    });

    it('should load the Manage > Users admin page correctly', async function () {
        await page.goto("?" + generalParams + "&module=UsersManager&action=index");

        // remove token auth which can be random
        await page.evaluate(function () {
            $('td#token_auth').each(function () {
                $(this).text('');
            });
            $('td#last_seen').each(function () {
                $(this).text( '' )
            });
        });

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('admin_manage_users');
    });

    it('should load the user settings admin page correctly', async function () {
        await page.goto("?" + generalParams + "&module=UsersManager&action=userSettings");

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('admin_user_settings');
    });

    it('should load the Manage > Tracking Code admin page correctly', async function () {
        await page.goto("?" + generalParams + "&module=CoreAdminHome&action=trackingCodeGenerator");

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('admin_manage_tracking_code');
    });

    it('should load the Settings > General Settings admin page correctly', async function () {
        await page.goto("?" + generalParams + "&module=CoreAdminHome&action=generalSettings");
        // angular might need a little to render after page has loaded
        await page.waitFor(1000);
        await page.evaluate(function () {
            $('textarea:eq(0)').trigger('focus');
        });
        await page.waitFor(1000);

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('admin_settings_general');
    });

    it('should load the Privacy Opt out iframe correctly', async function () {
        await page.goto("?module=CoreAdminHome&action=optOut&language=de");

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('admin_privacy_optout_iframe');
    });

    it('should load the Settings > Mobile Messaging admin page correctly', async function () {
        await page.goto("?" + generalParams + "&module=MobileMessaging&action=index");

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('admin_settings_mobilemessaging');
    });

    it('should switch the SMS provider correctly', async function () {
        await page.evaluate(function() {
            $('[name=smsProviders] ul li:nth-child(2)').click();
        });

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('admin_settings_mobilemessaging_provider');
    });

    it('should load the themes admin page correctly', async function () {
        await page.goto("?" + generalParams + "&module=CorePluginsAdmin&action=themes");

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('admin_themes');
    });

    it('should load the plugins admin page correctly', async function() {
        await page.goto("?" + generalParams + "&module=CorePluginsAdmin&action=plugins");

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('admin_plugins');
    });

    it('should load the config file page correctly', async function() {
        await page.goto("?" + generalParams + "&module=Diagnostics&action=configfile");

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('admin_diagnostics_configfile');
    });

    it('should load the Settings > Visitor Generator admin page correctly', async function() {
        await page.goto("?" + generalParams + "&module=VisitorGenerator&action=index");
        await page.evaluate(function () {
            var $p = $('#content p:eq(1)');
            $p.text($p.text().replace(/\(change .*\)/g, ''));
        });

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('admin_visitor_generator');
    });

    // Notifications
    it('should load the notifications page correctly', async function() {
        await page.goto("?" + generalParams + "&module=ExampleUI&action=notifications&idSite=1&period=day&date=yesterday");
        await page.evaluate(function () {
            $('#header').hide();
        });

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('notifications');
    });

    // Fatal error safemode
    it('should load the safemode fatal error page correctly', async function() {
        const message = "Call%20to%20undefined%20function%20Piwik%5CPlugins%5CFoobar%5CPiwik_Translate()";
        const file = "%2Fhome%2Fvagrant%2Fwww%2Fpiwik%2Fplugins%2FFoobar%2FFoobar.php%20line%205";
        const line = 58;

        await page.goto("?" + generalParams + "&module=CorePluginsAdmin&action=safemode&idSite=1&period=day&date=yesterday&activated"
                + "&error_message=" + message + "&error_file=" + file + "&error_line=" + line + "&tests_hide_piwik_version=1");
        await page.evaluate(function () {
            var elements = document.querySelectorAll('table tr td:nth-child(2)');
            for (var i in elements) {
                if (elements.hasOwnProperty(i) && elements[i].innerText.match(/^[0-9]\.[0-9]\.[0-9]$/)) {
                    elements[i].innerText = '3.0.0'
                }
            }
        });

        expect(await page.screenshot({ fullPage: true })).to.matchImage('fatal_error_safemode');
    });

    // invalid site parameter
    it('should show login form for non super user if invalid idsite given', async function() {
        testEnvironment.testUseMockAuth = 0;
        testEnvironment.save();

        await page.goto("?module=CoreHome&action=index&idSite=10006&period=week&date=2017-06-04");

        expect(await page.screenshot({ fullPage: true })).to.matchImage('invalid_idsite');
    });

    it('should show error for super user if invalid idsite given', async function() {
        await page.goto("?module=CoreHome&action=index&idSite=10006&period=week&date=2017-06-04");

        expect(await page.screenshot({ fullPage: true })).to.matchImage('invalid_idsite_superuser');
    });

    it('should load the glossary correctly', async function() {
        await page.goto("?" + generalParams + "&module=API&action=glossary");

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('glossary');
    });

    it('should load the glossary correctly widgetized', async function() {
        await page.goto("?" + generalParams + "&module=API&action=glossary&widget=1");

        expect(await page.screenshot({ fullPage: true })).to.matchImage('glossary_widgetized');
    });

    // DB error message
    it('should fail correctly when db information in config is incorrect', async function() {

        testEnvironment.overrideConfig('database', {
            host: config.phpServer.REMOTE_ADDR,
            username: 'slkdfjsdlkfj',
            password: 'slkdfjsldkfj',
            dbname: 'abcdefg',
            tables_prefix: 'gfedcba'
        });
        testEnvironment.save();

        await page.goto("");

        expect(await page.screenshot({ fullPage: true })).to.matchImage('db_connect_error');
    });

    // top bar pages
    it('should load the widgets listing page correctly', async function() {
        await page.goto("?" + generalParams + "&module=Widgetize&action=index");

        visitors = await page.$('.widgetpreview-categorylist>li:contains(Visitors):first');
        await visitors.hover();
        await page.click('.widgetpreview-categorylist>li:contains(Visitors):first');

        visitorsOT = await page.$('.widgetpreview-widgetlist li:contains(Visits Over Time)');
        await visitorsOT.hover();
        await page.click('.widgetpreview-widgetlist li:contains(Visits Over Time)');

        await page.evaluate(function () {
            $('.formEmbedCode').each(function () {
                var val = $(this).val();
                val = val.replace(/localhost\:[0-9]+/g, 'localhost');
                $(this).val(val);
            });
        });

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('widgets_listing');
    });

    it('should load the API listing page correctly', async function() {
        await page.goto("?" + generalParams + "&module=API&action=listAllAPI");

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('api_listing');
    });

    it('should load the email reports page correctly', async function() {
        await page.goto("?" + generalParams + "&module=ScheduledReports&action=index");
        await page.evaluate(function () {
            $('#header').hide();
        });

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('email_reports');
    });

    it('should load the scheduled reports when Edit button is clicked', async function() {
        await page.click('.entityTable tr:nth-child(4) button[title=Edit]');

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('email_reports_editor');
    });

    it('should load the feedback form when the feedback form link is clicked', async function() {
        await page.goto("?" + generalParams + "&module=Feedback&action=index");

        await page.evaluate(function () {
            $('.enrichedHeadline .title').each(function () {
                if ($(this).text().indexOf("Matomo") !== -1) {
                    var replace = $(this).text().replace(/Matomo\s*\d+\.\d+(\.\d+)?([\-a-z]*\d+)?/g, 'Matomo');
                    $(this).text(replace);
                }
            });
        });

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('feedback_form');
    });

    // date range clicked
    it('should reload to the correct date when a date range is selected in the period selector', async function() {
        await page.goto("?" + urlBase + "#?" + generalParams + "&category=General_Visitors&subcategory=VisitTime_SubmenuTimes");
        await page.waitForNetworkIdle();
        await page.click('#date.title');
        // we need to make sure there to wait for a bit till date is opened and period selected
        await page.click('#period_id_range');
        await page.evaluate(function () {
            $(document).ready(function () {
                $('#inputCalendarFrom').val('2012-08-02');
                $('#inputCalendarTo').val('2012-08-12');
                setTimeout(function () {$('#calendarApply').click();}, 500);
            });
        });

        expect(await page.screenshot({ fullPage: true })).to.matchImage('period_select_date_range_click');
    });

    // visitor profile popup
    it('should load the visitor profile popup correctly', async function() {
        await page.goto("?" + widgetizeParams + "&" + idSite2Params + "&moduleToWidgetize=Live&actionToWidgetize=getVisitorProfilePopup"
                + "&enableAnimation=0");

        await page.evaluate(function () {
            $(document).ready(function () {
                $('.visitor-profile-show-map').click();
            });
        });

        await page.waitFor(1000);

        expect(await page.screenshot({ fullPage: true })).to.matchImage('visitor_profile_popup');
    });

    // opt out page
    it('should load the opt out page correctly', async function() {
        testEnvironment.testUseMockAuth = 0;
        testEnvironment.save();

        await page.goto("?module=CoreAdminHome&action=optOut&language=en");

        expect(await page.screenshot({ fullPage: true })).to.matchImage('opt_out');
    });

    // extra segment tests
    it('should load the row evolution page correctly when a segment is selected', async function() {
        this.retries(3);
        expect.page().contains('.ui-dialog > .ui-dialog-content > div.rowevolution:visible', /*'segmented_rowevolution',*/ function (page) {
            var url = "?module=CoreHome&action=index&idSite=1&period=year&date=2012-01-13#?category=General_Visitors&subcategory=CustomVariables_CustomVariables&idSite=1&period=year&date=2012-01-13";
            page.goto(url, 1000);
            page.click('.segmentationTitle');
            page.click('.segname:contains(From Europe)', 1000);

            page.mouseMove('table.dataTable tbody tr:first-child');
            page.mouseMove('a.actionRowEvolution:visible'); // necessary to get popover to display
            page.click('a.actionRowEvolution:visible');
            page.wait(2000);

        }, done);
    });

    it('should load the segmented visitor log correctly when a segment is selected', async function() {
        const url = "?module=CoreHome&action=index&idSite=1&period=year&date=2012-01-13#?category=General_Visitors&subcategory=CustomVariables_CustomVariables&idSite=1&period=year&date=2012-01-13";
        await page.goto(url);
        await page.waitForNetworkIdle();
        await page.evaluate(function(){
            $('.segmentationTitle').click();
            $('.segname:contains(From Europe)').click();
        });
        await page.waitForNetworkIdle();

        elem = await page.$('table.dataTable tbody tr:first-child');
        await elem.hover();
        await page.evaluate(function(){
            var visitorLogLinkSelector = 'table.dataTable tbody tr:first-child a.actionSegmentVisitorLog';
            $(visitorLogLinkSelector).click();
        });
        await page.waitForNetworkIdle();
        elem = await page.$('#secondNavBar');
        await elem.hover();

        pageWrap = await page.$('.ui-dialog > .ui-dialog-content > div.dataTableVizVisitorLog');
        expect(await pageWrap.screenshot()).to.matchImage('segmented_visitorlog');
    });

    it('should not apply current segmented when opening visitor log', async function() {
        delete testEnvironment.queryParamOverride.visitorId;
        testEnvironment.save();

        const url = "?" + widgetizeParams + "&" + generalParams + "&moduleToWidgetize=Live&actionToWidgetize=getVisitorLog&segment=visitCount==2&enableAnimation=0";
        await page.goto(url);
        await page.waitForNetworkIdle();

        await page.evaluate(function () {
            $('.visitor-log-visitor-profile-link').first().click();
        });

        await page.waitForNetworkIdle();

        expect(await page.screenshot({ fullPage: true })).to.matchImage('visitor_profile_not_segmented');
    });
});
