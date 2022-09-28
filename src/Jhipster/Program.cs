using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Serilog;
using System;
using System.IO;
using System.Security.Authentication;
using JHipsterNet.Web.Logging;
using Serilog.Sinks.Syslog;
using ILogger = Serilog.ILogger;
using Jhipster;
using IStartup = Jhipster.IStartup;
using static JHipsterNet.Core.Boot.BannerPrinter;
using Microsoft.Extensions.Hosting;

PrintBanner(10 * 1000);

try
{
    var webAppOptions = new WebApplicationOptions
    {
        ContentRootPath = Directory.GetCurrentDirectory(),
        EnvironmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"),
        WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp", "dist"),
        Args = args
    };
    var builder = WebApplication.CreateBuilder(webAppOptions);

    builder.Logging.AddSerilog(CreateLogger(builder.Configuration));

    IStartup startup = new Startup();

    startup.Configure(builder.Configuration, builder.Services);
    startup.ConfigureServices(builder.Services, builder.Environment);

    WebApplication app = builder.Build();

    startup.ConfigureMiddleware(app, app.Environment);
    startup.ConfigureEndpoints(app, app.Environment);

    app
        .MapGet("/",
            () =>
            "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

    app.Run();

    return 0;
}
catch (Exception ex)
{
    // Use ForContext to give a context to this static environment (for Serilog LoggerNameEnricher).
    Log.ForContext<Program>().Fatal(ex, "Host terminated unexpectedly");
    return 1;
}
finally
{
    Log.CloseAndFlush();
}

public partial class Program
{
    const string SerilogSection = "Serilog";
    const string SyslogPort = "SyslogPort";
    const string SyslogUrl = "SyslogUrl";
    const string SyslogAppName = "SyslogAppName";

    /// <summary>
    /// Create application logger from configuration.
    /// </summary>
    /// <returns></returns>
    private static ILogger CreateLogger(IConfiguration appConfiguration)
    {
        var port = 6514;

        // for logger configuration
        // https://github.com/serilog/serilog-settings-configuration
        if (appConfiguration.GetSection(SerilogSection)[SyslogPort] != null)
        {
            if (int.TryParse(appConfiguration.GetSection(SerilogSection)[SyslogPort], out var portFromConf))
            {
                port = portFromConf;
            }
        }

        var url = appConfiguration.GetSection(SerilogSection)[SyslogUrl] != null
            ? appConfiguration.GetSection(SerilogSection)[SyslogUrl]
            : "localhost";
        var appName = appConfiguration.GetSection(SerilogSection)[SyslogAppName] != null
            ? appConfiguration.GetSection(SerilogSection)[SyslogAppName]
            : "JhipsterApp";
        var loggerConfiguration = new LoggerConfiguration()
            .Enrich.With<LoggerNameEnricher>()
            .WriteTo.TcpSyslog(url, port, appName, FramingType.OCTET_COUNTING, SyslogFormat.RFC5424, Facility.Local0, SslProtocols.None)
            .ReadFrom.Configuration(appConfiguration);

        return loggerConfiguration.CreateLogger();
    }
}
