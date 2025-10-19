// Minimal JSON parser (header-only) for local dev
// Supports: null, true/false, numbers, strings (basic escapes), arrays, objects
// Not a full JSON implementation; sufficient for our backend needs.

#pragma once
#include <string>
#include <vector>
#include <map>
#include <cctype>
#include <stdexcept>

namespace mini_json {

struct Value {
  enum Kind { Null, Bool, Number, String, Array, Object } kind = Null;
  bool b = false;
  double n = 0.0;
  std::string s;
  std::vector<Value> a;
  std::map<std::string, Value> o;

  bool isNull() const { return kind == Null; }
  bool isBool() const { return kind == Bool; }
  bool isNumber() const { return kind == Number; }
  bool isString() const { return kind == String; }
  bool isArray() const { return kind == Array; }
  bool isObject() const { return kind == Object; }

  const Value& operator[](const std::string &key) const {
    static Value nullV; auto it = o.find(key); return it == o.end() ? nullV : it->second;
  }
};

static void skip_ws(const std::string &str, size_t &i) {
  while (i < str.size() && std::isspace(static_cast<unsigned char>(str[i]))) i++;
}

static Value parse_value(const std::string &str, size_t &i);

static std::string parse_string_raw(const std::string &str, size_t &i) {
  std::string out; i++; // skip opening quote
  while (i < str.size()) {
    char c = str[i++];
    if (c == '"') break;
    if (c == '\\') {
      if (i >= str.size()) break;
      char e = str[i++];
      switch (e) {
        case '"': out += '"'; break;
        case '\\': out += '\\'; break;
        case '/': out += '/'; break;
        case 'b': out += '\b'; break;
        case 'f': out += '\f'; break;
        case 'n': out += '\n'; break;
        case 'r': out += '\r'; break;
        case 't': out += '\t'; break;
        case 'u': /* skip unicode */ out += '?'; i += 4; break;
        default: out += e; break;
      }
    } else {
      out += c;
    }
  }
  return out;
}

static Value parse_string(const std::string &str, size_t &i) {
  Value v; v.kind = Value::String; v.s = parse_string_raw(str, i); return v;
}

static Value parse_number(const std::string &str, size_t &i) {
  size_t start = i;
  if (str[i] == '-') i++;
  while (i < str.size() && std::isdigit(static_cast<unsigned char>(str[i]))) i++;
  if (i < str.size() && str[i] == '.') { i++; while (i < str.size() && std::isdigit(static_cast<unsigned char>(str[i]))) i++; }
  if (i < str.size() && (str[i] == 'e' || str[i] == 'E')) { i++; if (i < str.size() && (str[i] == '+' || str[i] == '-')) i++; while (i < str.size() && std::isdigit(static_cast<unsigned char>(str[i]))) i++; }
  double d = std::stod(str.substr(start, i - start));
  Value v; v.kind = Value::Number; v.n = d; return v;
}

static Value parse_array(const std::string &str, size_t &i) {
  Value v; v.kind = Value::Array; i++; // skip [
  skip_ws(str, i);
  if (i < str.size() && str[i] == ']') { i++; return v; }
  while (i < str.size()) {
    skip_ws(str, i);
    v.a.push_back(parse_value(str, i));
    skip_ws(str, i);
    if (i < str.size() && str[i] == ',') { i++; continue; }
    if (i < str.size() && str[i] == ']') { i++; break; }
  }
  return v;
}

static Value parse_object(const std::string &str, size_t &i) {
  Value v; v.kind = Value::Object; i++; // skip {
  skip_ws(str, i);
  if (i < str.size() && str[i] == '}') { i++; return v; }
  while (i < str.size()) {
    skip_ws(str, i);
    if (str[i] != '"') throw std::runtime_error("Invalid JSON object key");
    std::string key = parse_string_raw(str, i);
    skip_ws(str, i);
    if (str[i] != ':') throw std::runtime_error("Invalid JSON object colon");
    i++;
    skip_ws(str, i);
    v.o[key] = parse_value(str, i);
    skip_ws(str, i);
    if (i < str.size() && str[i] == ',') { i++; continue; }
    if (i < str.size() && str[i] == '}') { i++; break; }
  }
  return v;
}

static Value parse_value(const std::string &str, size_t &i) {
  skip_ws(str, i);
  if (i >= str.size()) { Value v; return v; }
  char c = str[i];
  if (c == 'n') { i += 4; Value v; return v; }
  if (c == 't') { i += 4; Value v; v.kind = Value::Bool; v.b = true; return v; }
  if (c == 'f') { i += 5; Value v; v.kind = Value::Bool; v.b = false; return v; }
  if (c == '"') return parse_string(str, i);
  if (c == '-' || std::isdigit(static_cast<unsigned char>(c))) return parse_number(str, i);
  if (c == '[') return parse_array(str, i);
  if (c == '{') return parse_object(str, i);
  Value v; return v;
}

static Value parse(const std::string &str) {
  size_t i = 0; return parse_value(str, i);
}

} // namespace mini_json

