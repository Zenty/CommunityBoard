namespace WebApp;

public static class RestApi
{
  public static void Start()
  {
    App.MapPost("/api/{table}", (
        HttpContext context, string table, JsonElement bodyJson
    ) =>
    {
      var body = JSON.Parse(bodyJson.ToString());
      body.Delete("id");
      var parsed = ReqBodyParse(table, body);
      var columns = parsed.insertColumns;
      var values = parsed.insertValues;
      var sql = $"INSERT INTO {table}({columns}) VALUES({values})";
      var result = SQLQueryOne(sql, parsed.body, context);
      if (!result.HasKey("error"))
      {
        // Get the insert id and add to our result
        result.insertId = SQLQueryOne(
                @$"SELECT id AS __insertId 
                       FROM {table} ORDER BY id DESC LIMIT 1"
            ).__insertId;
      }
      return RestResult.Parse(context, result);
    });

    App.MapGet("/api/{table}", (
        HttpContext context, string table
    ) =>
    {
      var sql = $"SELECT * FROM {table}";
      var query = RestQuery.Parse(context.Request.Query);
      sql += query.sql;

      var result = SQLQuery(sql, query.parameters, context);

      // Apply same JSON parsing logic to each row
      foreach (var row in result)
      {
        // Parse 'data' if it's a string
        if (row.HasKey("data") && row["data"] is string)
        {
          var dataStr = row["data"].ToString();
          try
          {
            row["data"] = JSON.Parse(dataStr);
          }
          catch
          {
            // Optionally log error
          }
        }

        // Parse 'commentsData' if from view_post_with_comments
        if (table == "view_post_with_comments" &&
            row.HasKey("commentsData") && row["commentsData"] is string)
        {
          var commentsStr = row["commentsData"].ToString();
          try
          {
            row["commentsData"] = JSON.Parse(commentsStr);
          }
          catch
          {
            // Optionally log error
          }
        }
      }

      return RestResult.Parse(context, result);
    });

    App.MapGet("/api/{table}/{id}", (
        HttpContext context, string table, string id
    ) =>
    {
      var result = SQLQueryOne(
          $"SELECT * FROM {table} WHERE id = $id",
          ReqBodyParse(table, Obj(new { id })).body,
          context
      );

      // Ensure `data` is parsed if it's a JSON string
      if (result.HasKey("data") && result["data"] is string)
      {
        try
        {
          var dataStr = result["data"].ToString();
          result["data"] = JSON.Parse(dataStr);
        }
        catch
        {
          // Optionally log parse error
        }
      }

      // Parse commentsData if it's from the view and it's a stringified array
      if (table == "view_post_with_comments" &&
          result.HasKey("commentsData") && result["commentsData"] is string)
      {
        try
        {
          var commentsStr = result["commentsData"].ToString();
          result["commentsData"] = JSON.Parse(commentsStr);
        }
        catch
        {
          // Optionally log parse error
        }
      }

      return RestResult.Parse(context, result);
    });

    App.MapPut("/api/{table}/{id}", (
        HttpContext context, string table, string id, JsonElement bodyJson
    ) =>
    {
      var body = JSON.Parse(bodyJson.ToString());
      body.id = id;
      var parsed = ReqBodyParse(table, body);
      var update = parsed.update;
      var sql = $"UPDATE {table} SET {update} WHERE id = $id";
      var result = SQLQueryOne(sql, parsed.body, context);
      return RestResult.Parse(context, result);
    });

    App.MapDelete("/api/{table}/{id}", (
         HttpContext context, string table, string id
    ) =>
        RestResult.Parse(context, SQLQueryOne(
            $"DELETE FROM {table} WHERE id = $id",
            ReqBodyParse(table, Obj(new { id })).body,
            context
        ))
    );
  }
}