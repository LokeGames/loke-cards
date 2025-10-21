# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]: Loke Graph
    - navigation "Breadcrumb" [ref=e6]:
      - list [ref=e7]:
        - listitem [ref=e8]:
          - link "Chapter Graph" [ref=e9] [cursor=pointer]:
            - /url: /chapter/chapter01
    - button "☀️" [ref=e11] [cursor=pointer]
  - generic [ref=e12]:
    - complementary [ref=e13]:
      - list [ref=e14]:
        - listitem [ref=e15]:
          - link "Global Graph" [ref=e16] [cursor=pointer]:
            - /url: /
      - generic [ref=e17]:
        - heading "Chapters" [level=3] [ref=e18]
        - list [ref=e19]:
          - listitem [ref=e20]:
            - link "Chapter 01" [ref=e21] [cursor=pointer]:
              - /url: /chapter/chapter01
          - listitem [ref=e22]:
            - link "Chapter 02" [ref=e23] [cursor=pointer]:
              - /url: /chapter/chapter02
    - main [ref=e24]:
      - generic [ref=e25]:
        - generic [ref=e26]:
          - button "Fit graph to view" [ref=e27] [cursor=pointer]: Fit View
          - button "Apply automatic layout" [ref=e28] [cursor=pointer]: Auto Layout
          - button "Save current layout" [ref=e29] [cursor=pointer]: Save Layout
        - generic [ref=e30]:
          - generic [ref=e32]:
            - generic:
              - img
          - img [ref=e33]
          - img "Vue Flow mini map" [ref=e36]
```