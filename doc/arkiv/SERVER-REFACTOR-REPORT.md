# Server Refactor Report

## Executive Summary

The `/server/` directory contains a C++ backend with architectural inconsistencies and code duplication that needs refactoring for maintainability and production readiness.

## Current Architecture Issues

### 1. Dual Code Generation Systems

**Problem**: Two parallel code generation implementations:

- **`code_generator.cpp`** (nlohmann/json)
  - Full-featured with proper structs (`SceneCard`, `Choice`, `StateChange`)
  - Production-ready with validation
  - **Not integrated** in main API

- **`codegen.cpp`** (mini_json)
  - Lightweight, actively used in `main.cpp:378`
  - Simple parsing without external dependencies
  - Hardcoded to frontend format

**Impact**: Code duplication, maintenance overhead, inconsistent behavior

### 2. Mixed JSON Libraries

**Problem**: Two different JSON parsers in same codebase:

```cpp
// code_generator.h:6
#include <nlohmann/json.hpp>
using json = nlohmann::json;

// main.cpp:17 + codegen.cpp:1
#include "include/mini_json.hpp"
```

**Impact**: Dependency bloat, learning curve, potential conflicts

### 3. Unused Production Features

**Problem**: Several components exist but aren't integrated:

- **`FileManager` class**: Complete project structure management
- **Project-based organization**: `/projects/{name}/{chapter}/` structure
- **Metadata management**: JSON-based project info
- **Systemd service**: Production deployment ready

**Impact**: Wasted development effort, incomplete feature set

### 4. Inconsistent Error Handling

**Problem**: Different error handling patterns:

```cpp
// code_generator.cpp:28
if (!std::isalpha(scene_id[0]) && scene_id[0] != '_') return false;

// main.cpp:83
if (sqlite3_prepare_v2(db, sql.c_str(), -1, &stmt, nullptr) != SQLITE_OK) {
    res.status = 500;
    res.set_content("{\"message\":\"DB prepare failed\"}", "application/json");
    return;
}
```

## Proposed Refactor Plan

### Phase 1: Consolidate Code Generation

**Objective**: Single, unified code generation system

**Actions**:

1. **Choose primary approach**: Migrate to `code_generator.cpp` (nlohmann/json)
2. **Update main.cpp**: Replace `generate_scene_code_from_json()` calls
3. **Remove mini_json**: Delete `include/mini_json.hpp` and `src/codegen.cpp`
4. **Update CMakeLists.txt**: Add nlohmann/json dependency

**Benefits**:

- Type safety with proper structs
- Better error handling
- Extensible architecture
- Industry-standard JSON library

### Phase 2: Integrate FileManager

**Objective**: Enable multi-project support

**Actions**:

1. **Instantiate FileManager**: Add to main.cpp
2. **Update API endpoints**: Add project_id parameter
3. **Modify build process**: Use FileManager for output
4. **Update database schema**: Add project_id to tables

**API Changes**:

```cpp
// Current: POST /api/scenes
// Future:  POST /api/projects/{project_id}/scenes

// Current: /api/build → ./output/
// Future:  /api/projects/{project_id}/build → ./projects/{project_id}/
```

### Phase 3: Standardize Error Handling

**Objective**: Consistent error handling across all components

**Actions**:

1. **Create error types**: Define standard error enums/classes
2. **Unified response format**: Standard JSON error responses
3. **Logging integration**: Add proper logging framework
4. **Validation layer**: Centralize input validation

### Phase 4: Production Optimization

**Objective**: Production-ready deployment

**Actions**:

1. **Configuration management**: Environment-based config
2. **Database migrations**: Version-controlled schema updates
3. **Health checks**: Enhanced health endpoints
4. **Performance monitoring**: Add metrics collection

## Implementation Priority

### High Priority (Phase 1)

- **Code generation consolidation**
- **Remove mini_json dependency**
- **Update main.cpp integration**

### Medium Priority (Phase 2)

- **FileManager integration**
- **Multi-project API design**
- **Database schema updates**

### Low Priority (Phase 3-4)

- **Error handling standardization**
- **Production optimizations**
- **Monitoring and logging**

## Risk Assessment

### Low Risk

- Removing unused code (mini_json)
- Updating build configuration
- Adding logging

### Medium Risk

- API endpoint changes
- Database schema modifications
- File system structure changes

### High Risk

- Large-scale refactoring of code generation
- Breaking changes to frontend integration
- Production deployment changes

## Migration Strategy

### Step 1: Preparation

1. **Backup current state**: Tag current version in git
2. **Test coverage**: Ensure existing tests pass
3. **Documentation**: Update API documentation

### Step 2: Incremental Changes

1. **Feature flags**: Use feature flags for gradual rollout
2. **Backward compatibility**: Maintain old endpoints during transition
3. **A/B testing**: Test new implementation alongside old

### Step 3: Cleanup

1. **Remove deprecated code**: Clean up old implementations
2. **Update documentation**: Ensure docs reflect new architecture
3. **Performance testing**: Validate no performance regression

## Success Metrics

### Technical Metrics

- **Code duplication**: Reduce by 80%
- **Build time**: Maintain or improve current build time
- **Test coverage**: Maintain >90% coverage
- **Memory usage**: No significant increase

### Functional Metrics

- **API response time**: <100ms for 95% of requests
- **Error rate**: <0.1% for successful operations
- **Build success rate**: 99%+ for generated code

### Development Metrics

- **Onboarding time**: Reduce new developer ramp-up time
- **Bug fix time**: Reduce average bug resolution time
- **Feature development**: Increase feature delivery velocity

## Conclusion

The server refactor addresses critical architectural issues while maintaining functionality. The phased approach minimizes risk and allows for incremental improvements. Priority should be given to consolidating the code generation system, as it provides the foundation for subsequent improvements.

**Estimated timeline**: 2-3 weeks for Phase 1, 4-6 weeks for complete refactor
**Risk level**: Medium (with proper testing and incremental approach)
**ROI**: High (reduced maintenance, improved developer experience, better scalability)
