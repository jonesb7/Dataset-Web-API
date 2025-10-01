# TCSS-460 HelloWorld API - Postman Testing Collection

Comprehensive Postman collection for testing the TCSS-460 Educational HelloWorld API. This collection provides complete test coverage for all health check endpoints and demonstrates API testing best practices.

## 📋 Collection Overview

### **Test Categories:**
- ✅ **Health Checks** - Basic and detailed health monitoring endpoints
- ✅ **API Information** - Root endpoint with API discovery
- ✅ **Error Handling** - 404 errors and malformed request testing
- ✅ **CORS Testing** - Cross-origin request validation
- ✅ **Performance Testing** - Response time and size validation

### **Total Test Cases:** 6 requests covering all API functionality

## 🚀 Quick Start

### Prerequisites
1. **API Server Running**: Ensure the HelloWorld API is running on `http://localhost:8000`
2. **Postman Installed**: Desktop app or web version

### Setup Instructions

1. **Import Collection**:
   ```
   File → Import → Choose Files → Select HelloWorld-API.postman_collection.json
   ```

2. **Import Environment**:
   ```
   File → Import → Choose Files → Select HelloWorld-Environment.postman_environment.json
   ```

3. **Select Environment**:
   - Click environment dropdown (top right)
   - Select "HelloWorld API Environment"

4. **Start Testing**:
   - Use "Run Collection" for automated testing
   - Or run individual requests manually

## 🧪 Test Scenarios

### **1. Health Checks**
- **Basic Health Check**: Tests `/health` endpoint for availability
- **Detailed Health Check**: Tests `/health/detailed` with system information
- Validates response structure, timestamps, and system metrics

### **2. API Information**
- **Root Endpoint**: Tests `/` for API information and endpoint discovery
- Validates API name, version, and available endpoints

### **3. Error Handling**
- **404 Testing**: Tests non-existent endpoints for proper error responses
- **JSON Syntax Errors**: Tests malformed JSON handling
- Validates error response structure and codes

### **4. CORS Testing**
- **Preflight Requests**: Tests OPTIONS requests for CORS headers
- Validates cross-origin request handling
- Tests allowed methods and headers

### **5. Performance Testing**
- **Response Time Validation**: Ensures endpoints respond quickly
- **Response Size Testing**: Validates reasonable response sizes
- **Consistency Checks**: Monitors performance across requests

## 🌐 Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `base_url` | API server base URL | `http://localhost:8000` |
| `api_version` | Current API version | `1.0.0` |
| `test_origin` | CORS test origin | `http://localhost:3000` |
| `environment_name` | Environment type | `development` |
| `test_timestamp` | Dynamic timestamp (auto-set) | *Generated* |
| `health_response_time` | Performance tracking | *Auto-captured* |

### Customizing Environment
- Click "Environment" dropdown → "HelloWorld API Environment"
- Modify variables as needed for your testing scenario
- Common customizations:
  - Change `base_url` for different environments (staging, production)
  - Update `test_origin` for different frontend applications
  - Modify `api_version` to match your deployment

## 📊 Test Automation

### **Running All Tests**
1. Click "Collections" in sidebar
2. Click "..." next to "TCSS-460 HelloWorld API"
3. Select "Run collection"
4. Configure run settings:
   - **Iterations**: 1 (recommended)
   - **Delay**: 100ms between requests
   - **Data**: None needed
5. Click "Run TCSS-460 HelloWorld API"

### **Test Results**
- ✅ **Green**: Test passed
- ❌ **Red**: Test failed
- 📊 **Summary**: Overall pass/fail statistics
- 📝 **Console**: Detailed logs and error messages

### **Expected Results**
With the HelloWorld API running:
- **Health Checks**: ✅ Should pass (tests basic and detailed endpoints)
- **API Information**: ✅ Should pass (validates root endpoint)
- **Error Handling**: ✅ Should pass (expected failures handled correctly)
- **CORS Testing**: ✅ Should pass (validates cross-origin headers)
- **Performance**: ✅ Should pass (response times under thresholds)

## 🔧 Troubleshooting

### Common Issues

**🔴 Connection Refused**
```
Error: connect ECONNREFUSED 127.0.0.1:8000
```
**Solution**: Start the API server with `npm run dev` or `npm start`

**🔴 404 Not Found on Health Check**
```
GET http://localhost:8000/health → 404
```
**Solution**: Verify API is running on correct port (should be 8000)

**🔴 CORS Errors**
```
Origin not allowed by CORS policy
```
**Solution**: Update `test_origin` environment variable or configure API CORS settings

**🔴 Performance Test Failures**
```
Response time exceeded threshold
```
**Solution**: Check if API server is running under load or adjust time thresholds

### **Debug Mode**
1. Open Postman Console (View → Show Postman Console)
2. Run individual requests to see detailed logs
3. Check response body for error details
4. Verify environment variables are set correctly

## 📚 Educational Features

### **Learning Objectives**
This collection demonstrates:
- **API Testing Best Practices**
- **Health Check Monitoring Patterns**
- **Error Handling Validation**
- **CORS Configuration Testing**
- **Performance Testing Basics**
- **Environment Management**

### **Code Examples**
Each test includes:
- Educational comments explaining testing concepts
- Comprehensive assertions for response validation
- Performance monitoring examples
- Error handling demonstrations

### **Test Organization**
- **Logical grouping** by API functionality
- **Educational comments** explaining each test
- **Performance tracking** with console logging
- **Global scripts** for common validations

## 🎯 Advanced Usage

### **Custom Test Scenarios**
1. **Load Testing**: Run collection multiple times with delays
2. **Environment Testing**: Use different base URLs for staging/production
3. **Integration Testing**: Chain requests for complex workflows
4. **Monitoring**: Schedule collection runs for API monitoring

### **Newman CLI Integration**
Run tests from command line:
```bash
# Install Newman globally
npm install -g newman

# Run collection
newman run HelloWorld-API.postman_collection.json \
  -e HelloWorld-Environment.postman_environment.json \
  --reporters cli,json

# Run with custom options
newman run HelloWorld-API.postman_collection.json \
  -e HelloWorld-Environment.postman_environment.json \
  --delay-request 500 \
  --timeout-request 10000 \
  --reporters htmlextra
```

### **CI/CD Integration**
Add to GitHub Actions or other CI systems for automated API testing:

```yaml
# .github/workflows/api-tests.yml
- name: Run Postman tests
  run: |
    npm install -g newman
    newman run testing/postman/HelloWorld-API.postman_collection.json \
      -e testing/postman/HelloWorld-Environment.postman_environment.json \
      --reporters cli,junit --reporter-junit-export results.xml
```

## 📝 Collection Maintenance

### **Updating Tests**
- Modify requests to match API changes
- Update environment variables as needed
- Add new test scenarios for new endpoints
- Keep assertions current with response format changes

### **Version Control**
- Export updated collection/environment files
- Commit changes to repository
- Document breaking changes in commit messages
- Tag releases for version tracking

### **Extending the Collection**
When adding new API endpoints:
1. Create new request in appropriate folder
2. Add comprehensive test scripts
3. Update environment variables if needed
4. Document new tests in this README
5. Test thoroughly before committing

---

**Happy Testing! 🚀**

*This collection is designed for educational purposes as part of the TCSS-460 Web APIs course, demonstrating professional API testing practices.*