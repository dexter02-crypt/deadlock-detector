# Deadlock Detector

Interactive resource-allocation graph explorer for a single-instance resource model.

Edges have explicit meaning:

- `P -> R` is a request;
- `R -> P` is an assignment.

The project detects a directed cycle and derives a process-to-process wait-for graph.

## Important scope boundary

For this project each resource node represents a **single resource instance**. Under that model, a cycle is sufficient to identify deadlock. The same conclusion does not automatically hold for arbitrary multi-instance resource-allocation systems.

## Run

```bash
python3 serve.py
```

## Test

```bash
npm test
```

## License

MIT. Maintainer: Shikhar Singh.
